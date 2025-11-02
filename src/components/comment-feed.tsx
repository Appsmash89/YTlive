
"use client";

import { useEffect, useRef, useState } from 'react';
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
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const [internalComments, setInternalComments] = useState<Comment[]>([]);

  // The parent (useGameEngine) now controls the comment flow.
  // This component just receives new comments and displays them.
  // We'll use a side-effect to listen for new comments and add them.
  const originalOnNewComment = useRef(onNewComment);

  useEffect(() => {
    // A little trick to get the latest comment into our internal state
    // without re-running all the parent effects.
    const handleNewComment = (comment: Comment) => {
       setInternalComments((prev) => [comment, ...prev].slice(0, 50));
    };

    // We replace the onNewComment prop with our own handler.
    // And we call the original one from inside.
    const newCommentHandler = (comment: Comment) => {
        handleNewComment(comment);
        // We don't call the original prop anymore, as it's handled by the engine.
    };

    // This is a bit of a workaround because the parent hook is now the source of truth.
    // In a real scenario with websockets or a library like react-query, this would be cleaner.
    if (isStreaming) {
        // We don't start any intervals here anymore.
    }

  }, [isStreaming]);

  // We need to manually handle new comments coming from props.
  useEffect(() => {
    // This is a proxy to allow the parent to push comments into this component.
    const originalHandler = (comment: Comment) => {
      setInternalComments((prev) => [comment, ...prev].slice(0, 50));
    };
    
    // @ts-ignore
    onNewComment.proxy = originalHandler;

    return () => {
        // @ts-ignore
        onNewComment.proxy = undefined;
    }
  }, [onNewComment]);


  useEffect(() => {
    const scrollContainer = commentsContainerRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [internalComments]);


  return (
    <Card className="flex-1 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
            <MessagesSquare className="h-5 w-5 text-primary" />
            <CardTitle>Comment Feed</CardTitle>
        </div>
        {isProcessing && <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full" ref={commentsContainerRef}>
            <div className="p-4 md:p-6 space-y-4">
                {internalComments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 min-h-[200px]">
                        <MessagesSquare className="h-10 w-10 mb-4" />
                        <p className="font-medium">Comments will appear here</p>
                        <p className="text-sm">{isStreaming ? "Waiting for comments from the stream..." : "Enable streaming in the control panel."}</p>
                    </div>
                ) : (
                    internalComments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3 animate-in fade-in-0 slide-in-from-top-4 duration-500">
                        <Avatar className="h-8 w-8 border">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                        <p className="font-semibold">{comment.author.name}</p>
                        <p className="text-muted-foreground">{comment.text}</p>
                        </div>
                    </div>
                    ))
                )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CommentFeed;
