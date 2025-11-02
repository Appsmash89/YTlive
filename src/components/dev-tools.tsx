"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Bug } from 'lucide-react';

interface DevToolsProps {
  onManualComment: (comment: string) => void;
}

const DevTools = ({ onManualComment }: DevToolsProps) => {
  const [commentText, setCommentText] = useState('');

  const handleSendComment = () => {
    if (commentText.trim()) {
      onManualComment(commentText.trim());
      setCommentText('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Dev Tools
        </CardTitle>
        <CardDescription>
          Manually send comments to the feed for testing purposes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Textarea
            placeholder="Type a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendComment();
              }
            }}
          />
          <Button onClick={handleSendComment} className="w-full">
            <Send className="mr-2" />
            Send Comment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevTools;
