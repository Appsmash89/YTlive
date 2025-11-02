
"use server";
import { google } from 'googleapis';
import type { YouTubeComment } from './types';

const youtube = google.youtube('v3');

// This function finds the liveChatId for a given video ID.
export async function getLiveChatId(videoId: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_API_KEY is not set.');
    // Silently fail if key is not set, the UI will handle it.
    return null;
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
      console.warn(`Could not find live chat for video ID: ${videoId}. Is it a live stream with chat enabled?`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching live chat ID:", error);
    // Return null to allow the UI to handle the error gracefully
    return null;
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
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
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
