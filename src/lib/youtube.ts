"use server";
import { google } from 'googleapis';
import type { YouTubeComment } from './types';

const youtube = google.youtube('v3');

// This function would live on a server, not in the client bundle.
// For this example, we'll call it from a Server Action or a dedicated API route.
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
}
