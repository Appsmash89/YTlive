"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MessagesSquare } from 'lucide-react';
import type { Comment } from '@/lib/types';
import { generateMockComment } from '@/lib/mock-data';

interface CommentFeedProps {
  onNewComment: (comment: Comment) => void;
  isStreaming: boolean;
  isProcessing: boolean;
}

const CommentFeed = ({ onNewComment, isStreaming, isProcessing }: CommentFeedProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleNewComment = useCallback(() => {
    onNewComment(generateMockComment());
  }, [onNewComment]);

  useEffect(() => {
    if (isStreaming) {
      intervalRef.current = setInterval(() => {
        handleNewComment();
      }, 3000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStreaming, handleNewComment]);

  useEffect(() => {
    if (commentsContainerRef.current) {
      const { scrollHeight, clientHeight } = commentsContainerRef.current;
      commentsContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  }, [onNewComment]);


  return (
    <Card className="flex-1 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
            <MessagesSquare className="h-5 w-5" />
            <CardTitle>Comment Feed</CardTitle>
        </div>
        {isProcessing && <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full" ref={commentsContainerRef}>
            <div className="p-4 space-y-4" ref={scrollAreaRef}>
                <InternalFeed onNewComment={onNewComment}/>
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};


const InternalFeed = ({ onNewComment }: { onNewComment: (comment: Comment) => void }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    
    useEffect(() => {
        const handler = (comment: Comment) => {
            setComments((prev) => [comment, ...prev].slice(0, 50));
        }

        const originalOnNewComment = onNewComment;
        (onNewComment as any) = handler;

        return () => {
            (onNewComment as any) = originalOnNewComment;
        }

    }, [onNewComment]);

    if (comments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <MessagesSquare className="h-10 w-10 mb-4" />
                <p className="font-medium">Comments will appear here</p>
                <p className="text-sm">Enable "Live Comments" in the control panel to start the simulation.</p>
            </div>
        )
    }

    return (
        <>
            {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8 border">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                <p className="font-semibold">{comment.author.name}</p>
                <p className="text-muted-foreground">{comment.text}</p>
                </div>
            </div>
            )).reverse()
        }
        </>
    );
};


export default CommentFeed;
