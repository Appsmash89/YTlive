"use client";

import { useState, useCallback, useMemo } from 'react';
import type { Comment, CommandLog } from '@/lib/types';
import { analyzeCommentAction, suggestKeywordsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/layout/header';
import ControlPanel from '@/components/control-panel';
import CommentFeed from '@/components/comment-feed';
import CommandLogDisplay from '@/components/command-log';

const INITIAL_KEYWORDS = ['forward', 'back', 'left', 'right', 'jump', 'stop', 'go'];

export default function Home() {
  const [keywords, setKeywords] = useState<string[]>(INITIAL_KEYWORDS);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commandHistory, setCommandHistory] = useState<CommandLog[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleNewComment = useCallback(async (comment: Comment) => {
    setIsProcessing(true);
    setComments(prev => [comment, ...prev]);

    try {
      const result = await analyzeCommentAction({ comment: comment.text, keywords });
      const newLog: CommandLog = {
        id: comment.id,
        comment,
        command: result.command,
        feedback: result.feedback,
        timestamp: new Date(),
      };
      setCommandHistory(prev => [newLog, ...prev]);
    } catch (error) {
      console.error("Error analyzing comment:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to analyze comment.",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [keywords, toast]);

  const handleAddKeyword = (keyword: string) => {
    const newKeyword = keyword.trim().toLowerCase();
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords(prev => [...prev, newKeyword]);
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(prev => prev.filter(k => k !== keywordToRemove));
  };

  const handleSuggestKeywords = useCallback(async () => {
    const recentComments = comments.slice(0, 20).map(c => c.text).join('\n');
    if (recentComments.length === 0) {
      toast({
        title: "Not enough data",
        description: "No comments to analyze for keyword suggestions.",
      });
      return [];
    }

    try {
      const result = await suggestKeywordsAction({
        comments: recentComments,
        existingKeywords: keywords.join(', '),
      });
      const suggestions = result.suggestedKeywords
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(k => k && !keywords.includes(k));
      
      if (suggestions.length === 0) {
        toast({
          title: "No new suggestions",
          description: "AI could not find any new keywords to suggest.",
        });
      }
      return suggestions;
    } catch (error) {
      console.error("Error suggesting keywords:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to get keyword suggestions.",
      });
      return [];
    }
  }, [comments, keywords, toast]);

  const allCommentsText = useMemo(() => comments.map(c => c.text).join('\n'), [comments]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-6">
          <div className="md:col-span-4 lg:col-span-3 h-full overflow-y-auto rounded-lg">
            <ControlPanel
              keywords={keywords}
              onAddKeyword={handleAddKeyword}
              onRemoveKeyword={handleRemoveKeyword}
              isStreaming={isStreaming}
              onToggleStreaming={() => setIsStreaming(prev => !prev)}
              onSuggestKeywords={handleSuggestKeywords}
            />
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
