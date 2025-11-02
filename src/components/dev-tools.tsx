
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Bug } from 'lucide-react';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface DevToolsProps {
  onManualComment: (comment: string) => void;
  keywords: string[];
}

const DevTools = ({ onManualComment, keywords }: DevToolsProps) => {
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
      <CardContent className="space-y-4">
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
        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Click to send a keyword comment:</p>
            <ScrollArea className="h-24">
                <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                        <Badge 
                            key={keyword} 
                            variant="secondary" 
                            className="cursor-pointer hover:bg-primary/20"
                            onClick={() => onManualComment(keyword)}
                        >
                            {keyword}
                        </Badge>
                    ))}
                </div>
            </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevTools;
