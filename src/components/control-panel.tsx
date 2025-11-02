
"use client";

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import type { StreamStatus } from '@/lib/types';

interface ControlPanelProps {
  streamStatus: StreamStatus;
  onToggleStreaming: () => void;
  youtubeVideoId: string;
  onYoutubeVideoIdChange: (id: string) => void;
}

const ControlPanel = ({
  streamStatus,
  onToggleStreaming,
  youtubeVideoId,
  onYoutubeVideoIdChange,
}: ControlPanelProps) => {
  const isStreaming = streamStatus === 'connected' || streamStatus === 'connecting';

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const url = new URL(e.target.value);
      const videoId = url.searchParams.get('v');
      if (videoId) {
        onYoutubeVideoIdChange(videoId);
      } else {
        onYoutubeVideoIdChange(e.target.value); // Allow direct ID paste
      }
    } catch (error) {
       onYoutubeVideoIdChange(e.target.value); // Allow direct ID paste
    }
  }

  const getStatusText = () => {
    switch(streamStatus) {
      case 'idle':
        return 'Stream connection paused.';
      case 'connecting':
        return 'Connecting to stream...';
      case 'connected':
        return 'Fetching live comments.';
      case 'error':
        return 'Connection failed. Check ID/key.';
    }
  }

  return (
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="stream-url">YouTube Stream URL or Video ID</Label>
          <Input 
            id="stream-url" 
            placeholder="https://youtube.com/watch?v=..."
            onChange={handleUrlChange}
            disabled={isStreaming}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <div className='flex items-center gap-2'>
              <Label htmlFor="stream-status">Live Comments</Label>
              {streamStatus === 'connecting' && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <p className="text-xs text-muted-foreground">
              {getStatusText()}
            </p>
          </div>
          <Switch
            id="stream-status"
            checked={isStreaming}
            onCheckedChange={onToggleStreaming}
            aria-label="Toggle comment stream"
          />
        </div>
      </CardContent>
  );
};

export default ControlPanel;
