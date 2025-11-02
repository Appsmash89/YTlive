
"use client";

import { useState, useCallback } from 'react';
import type { Comment, CommandLog } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/layout/header';
import ControlPanel from '@/components/control-panel';
import CommentFeed from '@/components/comment-feed';
import CommandLogDisplay from '@/components/command-log';
import DevTools from '@/components/dev-tools';
import { generateMockComment } from '@/lib/mock-data';
import DisplayViewport from '@/components/display-viewport';
import { mediaMap } from '@/lib/media';

const INITIAL_KEYWORDS = ['forward', 'back', 'left', 'right', 'jump', 'stop', 'go', 'pizza', 'burger', 'coke', 'fries'];

export default function Home() {
  const [keywords, setKeywords] = useState<string[]>(INITIAL_KEYWORDS);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commandHistory, setCommandHistory] = useState<CommandLog[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeMedia, setActiveMedia] = useState<{url: string; type: string; command: string; authorName: string;} | null>(null);
  const { toast } = useToast();

  const analyzeComment = useCallback((commentText: string, keywords: string[]): { command: string | undefined, feedback: string | undefined } => {
    const lowerCaseComment = commentText.toLowerCase();
    for (const keyword of keywords) {
      if (lowerCaseComment.includes(keyword)) {
        const command = keyword.replace(/\s+/g, '-');
        return { command, feedback: `Command found: ${keyword}` };
      }
    }
    return { command: undefined, feedback: 'No command detected' };
  }, []);

  const handleNewComment = useCallback(async (comment: Comment) => {
    setIsProcessing(true);
    setComments(prev => [comment, ...prev]);

    const result = analyzeComment(comment.text, keywords);

    if (result.command && mediaMap[result.command]) {
      setActiveMedia({
        ...mediaMap[result.command],
        command: result.command,
        authorName: comment.author.name,
      });
    }

    const newLog: CommandLog = {
      id: comment.id,
      comment,
      command: result.command,
      feedback: result.feedback,
      timestamp: new Date(),
    };
    setCommandHistory(prev => [newLog, ...prev]);
    setIsProcessing(false);
  }, [keywords, analyzeComment]);

  const handleAddKeyword = (keyword: string) => {
    const newKeyword = keyword.trim().toLowerCase();
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords(prev => [...prev, newKeyword]);
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(prev => prev.filter(k => k !== keywordToRemove));
  };
  
  const handleManualComment = (commentText: string) => {
    const comment = generateMockComment(commentText);
    handleNewComment(comment);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-6">
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
            <ControlPanel
              keywords={keywords}
              onAddKeyword={handleAddKeyword}
              onRemoveKeyword={handleRemoveKeyword}
              isStreaming={isStreaming}
              onToggleStreaming={() => setIsStreaming(prev => !prev)}
            />
            <DevTools onManualComment={handleManualComment} />
          </div>
          <div className="md:col-span-8 lg:col-span-9 grid grid-rows-3 gap-6 h-full">
             <div className="row-span-2">
               <DisplayViewport activeMedia={activeMedia} />
             </div>
             <div className="row-span-1 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[300px]">
                <div className="h-full flex flex-col">
                    <CommentFeed
                      onNewComment={handleNewComment}
                      isStreaming={isStreaming}
                      isProcessing={isProcessing}
                    />
                </div>
                <div className="h-full flex flex-col">
                    <CommandLogDisplay history={commandHistory} />
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
