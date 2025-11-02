
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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Youtube, Bug, Settings2, Languages } from 'lucide-react';

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
             <Accordion type="multiple" defaultValue={['stream-controls', 'keyword-recognition', 'dev-tools']} className="w-full space-y-6">
               <AccordionItem value="stream-controls" className="border-none">
                  <Card>
                    <AccordionTrigger className="p-6 hover:no-underline">
                      <CardHeader className="p-0">
                        <CardTitle className="flex items-center gap-2">
                           <Youtube className="h-5 w-5 text-red-500" />
                           Stream Controls
                        </CardTitle>
                        <CardDescription>Connect to your stream and manage settings.</CardDescription>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ControlPanel
                        isStreaming={isStreaming}
                        onToggleStreaming={() => setIsStreaming(prev => !prev)}
                      />
                    </AccordionContent>
                  </Card>
                </AccordionItem>

              <AccordionItem value="keyword-recognition" className="border-none">
                <Card>
                  <AccordionTrigger className="p-6 hover:no-underline">
                      <CardHeader className="p-0">
                        <CardTitle className="flex items-center gap-2">
                          <Languages className="h-5 w-5" />
                          Keyword Recognition
                        </CardTitle>
                        <CardDescription>Add or remove keywords for command recognition.</CardDescription>
                      </CardHeader>
                  </AccordionTrigger>
                  <AccordionContent>
                      <ControlPanel.KeywordEditor
                        keywords={keywords}
                        onAddKeyword={handleAddKeyword}
                        onRemoveKeyword={handleRemoveKeyword}
                      />
                  </AccordionContent>
                </Card>
              </AccordionItem>

              <AccordionItem value="dev-tools" className="border-none">
                <Card>
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <CardHeader className="p-0">
                            <CardTitle className="flex items-center gap-2">
                                <Bug className="h-5 w-5" />
                                Dev Tools
                            </CardTitle>
                             <CardDescription>Manually send comments for testing purposes.</CardDescription>
                        </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                        <DevTools onManualComment={handleManualComment} keywords={keywords} />
                    </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
             <div>
               <DisplayViewport activeMedia={activeMedia} />
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[300px]">
                <div className="flex flex-col">
                    <CommentFeed
                      onNewComment={handleNewComment}
                      isStreaming={isStreaming}
                      isProcessing={isProcessing}
                    />
                </div>
                <div className="flex flex-col">
                    <CommandLogDisplay history={commandHistory} />
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
