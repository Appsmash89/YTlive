
"use server";
import { google } from 'googleapis';
import type { YouTubeComment } from './types';

const youtube = google.youtube('v3');

// This function finds the liveChatId for a given video ID.
export async function getLiveChatId(videoId: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY is not set in .env file');
  }

  // If videoId is a mock, return a mock chat ID
  if (videoId === 'mock-video-id') {
    return 'mock-chat-id-for-' + videoId;
  }
  
  try {
    const response = await youtube.videos.list({
      key: apiKey,
      id: [videoId],
      part: ['liveStreamingDetails'],
    });

    const video = response.data.items?.[0];
    if (video && video.liveStreamingDetails && video.liveStreamingDetails.activeLiveChatId) {
      return video.liveStreamingDetails.activeLiveChatId;
    } else {
      return null; // Not a live video or chat is disabled
    }
  } catch (error) {
    console.error("Error fetching live chat ID:", error);
    throw new Error("Could not retrieve live chat details from YouTube. Check the video ID.");
  }
}


// This function fetches messages from a specific live chat.
export async function fetchLiveChatMessages({
  liveChatId,
  pageToken,
}: {
  liveChatId: string;
  pageToken?: string;
}): Promise<{
  comments: YouTubeComment[];
  nextPageToken: string | undefined;
  pollingIntervalMillis: number | undefined;
}> {

  // In a real app, you would get the API key from environment variables
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY is not set');
  }

  // If liveChatId is a mock, return mock comments
  if (liveChatId.startsWith('mock-chat-id')) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    const mockComments = [
      {
        id: `mock-${Date.now()}`,
        author: { name: 'MockUser', avatar: 'https://picsum.photos/seed/mock/40/40' },
        text: 'This is a mock comment!',
      },
      {
        id: `mock-${Date.now()+1}`,
        author: { name: 'TestBot', avatar: 'https://picsum.photos/seed/bot/40/40' },
        text: 'up',
      },
    ];
    return {
      comments: mockComments,
      nextPageToken: pageToken,
      pollingIntervalMillis: 5000,
    };
  }

  try {
    const response = await youtube.liveChatMessages.list({
      key: apiKey,
      liveChatId,
      part: ['snippet', 'authorDetails'],
      pageToken: pageToken,
    });

    const messages = response.data.items || [];
    const comments: YouTubeComment[] = messages.map(item => ({
      id: item.id!,
      author: {
        name: item.authorDetails!.displayName!,
        avatar: item.authorDetails!.profileImageUrl!,
      },
      text: item.snippet!.displayMessage!,
    }));

    return {
      comments,
      nextPageToken: response.data.nextPageToken ?? undefined,
      pollingIntervalMillis: response.data.pollingIntervalMillis ?? undefined,
    };
  } catch(error: any) {
     console.error("Error in fetchLiveChatMessages: ", error.message);
     throw new Error("Failed to fetch comments from YouTube. Is the stream active?");
  }
}
