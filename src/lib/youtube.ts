
"use server";
import { google } from 'googleapis';
import type { YouTubeComment } from './types';
import { generateMockComment } from './mock-data';

const youtube = google.youtube('v3');

// This function finds the liveChatId for a given video ID.
export async function getLiveChatId(videoId: string): Promise<string | null> {
  // If videoId is a mock, return a mock chat ID immediately.
  if (videoId === 'mock-video-id') {
    return 'mock-chat-id-for-' + videoId;
  }
  
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_API_KEY is not set. Using mock ID as fallback.');
    // To prevent crashes when the key is missing, we can pretend it's a mock video.
    // This allows the UI to function without a real key.
    return 'mock-chat-id-for-mock-video-id';
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
      // The video might not be a live stream or might have chat disabled.
      // We can return a mock ID to prevent the app from crashing.
      console.warn(`Could not find live chat for video ID: ${videoId}. Is it a live stream?`);
      return `mock-chat-id-for-${videoId}`;
    }
  } catch (error) {
    console.error("Error fetching live chat ID:", error);
    // Throwing an error here can crash the app if not handled well.
    // Let's return a mock ID to ensure the UI remains interactive.
    return `mock-chat-id-for-${videoId}`;
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

  // If liveChatId is a mock, return mock comments
  if (liveChatId.startsWith('mock-chat-id')) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const mockComments = [
      generateMockComment(),
      generateMockComment(),
    ].map(c => ({...c, text: c.text.toLowerCase()})); // Use mock data generator
    
    return {
      comments: mockComments,
      nextPageToken: pageToken,
      pollingIntervalMillis: 5000,
    };
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    // This should ideally not be reached because getLiveChatId would have returned a mock id.
    // But as a safeguard:
    throw new Error('GOOGLE_API_KEY is not set');
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
     // To prevent UI crashing, return an empty array on failure.
     return {
        comments: [],
        nextPageToken: pageToken,
        pollingIntervalMillis: 10000, // Slow down polling on error
     }
  }
}
