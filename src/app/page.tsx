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

const INITIAL_KEYWORDS = ['forward', 'back', 'left', 'right', 'jump', 'stop', 'go', 'pizza', 'burger', 'coke', 'fries'];

export default function Home() {
  const [keywords, setKeywords] = useState<string[]>(INITIAL_KEYWORDS);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commandHistory, setCommandHistory] = useState<CommandLog[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const analyzeComment = useCallback((commentText: string, keywords: string[]): { command: string | undefined, feedback: string | undefined } => {
    const lowerCaseComment = commentText.toLowerCase();
    for (const keyword of keywords) {
      if (lowerCaseComment.includes(keyword)) {
        // Simple mapping from keyword to a command-like string
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
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-6">
          <div className="md:col-span-4 lg:col-span-3 h-full overflow-y-auto rounded-lg flex flex-col gap-6">
            <ControlPanel
              keywords={keywords}
              onAddKeyword={handleAddKeyword}
              onRemoveKeyword={handleRemoveKeyword}
              isStreaming={isStreaming}
              onToggleStreaming={() => setIsStreaming(prev => !prev)}
            />
            <DevTools onManualComment={handleManualComment} />
          </div>
          <div className="md:col-span-4 lg:col-span-5 h-full flex flex-col">
            <CommentFeed
              onNewComment={handleNewComment}
              isStreaming={isStreaming}
              isProcessing={isProcessing}
            />
          </div>
          <div className="md:col-span-4 lg:col-span-4 h-full flex flex-col">
            <CommandLogDisplay history={commandHistory} />
          </div>
        </div>
      </main>
    </div>
  );
}
