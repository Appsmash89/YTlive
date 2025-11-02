
"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Comment, CommandLog, DisplayMode, TarotCard, CarState, MazeState } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/layout/header';
import ControlPanel from '@/components/control-panel';
import CommentFeed from '@/components/comment-feed';
import CommandLogDisplay from '@/components/command-log';
import DevTools from '@/components/dev-tools';
import { generateMockComment } from '@/lib/mock-data';
import DisplayViewport from '@/components/display-viewport';
import { mediaMap } from '@/lib/media';
import { tarotCards } from '@/lib/tarot-cards';
import { generateMaze } from '@/lib/maze';


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Youtube, Bug, Settings2, Languages } from 'lucide-react';

const INITIAL_KEYWORDS = ['forward', 'back', 'left', 'right', 'jump', 'stop', 'go', 'pizza', 'burger', 'coke', 'fries', 'brake', 'up', 'down'];

const MAZE_ROWS = 21;
const MAZE_COLS = 31;

const INITIAL_MAZE_STATE = generateMaze(MAZE_ROWS, MAZE_COLS);

export default function Home() {
  const [keywords, setKeywords] = useState<string[]>(INITIAL_KEYWORDS);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commandHistory, setCommandHistory] = useState<CommandLog[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('fastfood');
  
  const [activeMedia, setActiveMedia] = useState<{url: string; type: string; command: string; authorName: string;} | null>(null);
  const [activeTarotCard, setActiveTarotCard] = useState<TarotCard | null>(null);
  const [carState, setCarState] = useState<CarState>({ position: 'center', speed: 'stopped' });
  const [mazeState, setMazeState] = useState<MazeState>(INITIAL_MAZE_STATE);
  
  const { toast } = useToast();

  const validMoveAudioRef = useRef<HTMLAudioElement>(null);
  const invalidMoveAudioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (mazeState.isComplete) {
      toast({
        title: "Puzzle Complete!",
        description: "A new maze has been generated.",
      });
      // Add a small delay before generating a new maze to allow the user to see the completed state
      setTimeout(() => {
        setMazeState(generateMaze(MAZE_ROWS, MAZE_COLS));
      }, 1000);
    }
  }, [mazeState.isComplete, toast]);

  const analyzeComment = useCallback((commentText: string, keywords: string[]): { command: string | undefined, feedback: string | undefined } => {
    const lowerCaseComment = commentText.toLowerCase();
    for (const keyword of keywords) {
      if (lowerCaseComment.includes(keyword)) {
        let command = keyword.replace(/\s+/g, '-');
        // Consolidate movement commands
        if (['forward', 'go'].includes(keyword)) command = 'forward';
        if (['stop', 'brake'].includes(keyword)) command = 'stop';
        return { command, feedback: `Command found: ${keyword}` };
      }
    }
    return { command: undefined, feedback: 'No command detected' };
  }, []);
  
  const getRandomTarotCard = useCallback((): { card: TarotCard, feedback: string } => {
    const card = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    return { card, feedback: `Drew the ${card.name} card` };
  }, []);

  const handleNewComment = useCallback(async (comment: Comment) => {
    setIsProcessing(true);
    setComments(prev => [comment, ...prev]);

    let result: { command: string | undefined, feedback: string | undefined } = { command: undefined, feedback: 'No command detected' };
    
    if (displayMode === 'tarot') {
      const tarotResult = getRandomTarotCard();
      setActiveTarotCard(tarotResult.card);
      setActiveMedia({ url: '', type: '', command: 'tarot', authorName: comment.author.name });
      result = { command: 'tarot-draw', feedback: tarotResult.feedback };
    } else if (displayMode === 'drive') {
      result = analyzeComment(comment.text, ['left', 'right', 'forward', 'go', 'stop', 'brake']);
      if (result.command) {
        setCarState(prevState => {
          let { position, speed } = prevState;
          if (result.command === 'left') position = 'left';
          else if (result.command === 'right') position = 'right';
          else if (result.command === 'forward') {
            speed = 'moving';
            position = 'center';
          }
          else if (result.command === 'stop') speed = 'stopped';
          return { position, speed };
        });
      }
    } else if (displayMode === 'findway') {
       result = analyzeComment(comment.text, ['up', 'down', 'left', 'right']);
      if (result.command) {
        setMazeState(prevState => {
          if (prevState.isComplete) return prevState;
          
          const { maze, playerPosition } = prevState;
          let { row, col } = playerPosition;
          let newRow = row;
          let newCol = col;

          if (result.command === 'up' && row > 0 && maze[row - 1][col] !== 'wall') newRow--;
          else if (result.command === 'down' && row < maze.length - 1 && maze[row + 1][col] !== 'wall') newRow++;
          else if (result.command === 'left' && col > 0 && maze[row][col - 1] !== 'wall') newCol--;
          else if (result.command === 'right' && col < maze[0].length - 1 && maze[row][col + 1] !== 'wall') newCol++;

          const positionChanged = newRow !== row || newCol !== col;

          if (positionChanged) {
            validMoveAudioRef.current?.play();
          } else {
            invalidMoveAudioRef.current?.play();
          }

          const newPosition = { row: newRow, col: newCol };
          const isComplete = prevState.maze[newPosition.row][newPosition.col] === 'end';

          return { ...prevState, playerPosition: newPosition, isComplete };
        });
      }
    }
    else { // FastFood mode
      result = analyzeComment(comment.text, keywords);
      if (result.command && mediaMap[result.command]) {
        setActiveMedia({
          ...mediaMap[result.command],
          command: result.command,
          authorName: comment.author.name,
        });
      }
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
  }, [keywords, analyzeComment, displayMode, getRandomTarotCard]);

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
  
  const handleModeChange = (mode: DisplayMode) => {
    setDisplayMode(mode);
    setActiveMedia(null);
    setActiveTarotCard(null);
    setCarState({ position: 'center', speed: 'stopped' });
    if (mode === 'findway') {
      setMazeState(generateMaze(MAZE_ROWS, MAZE_COLS));
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-6">
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
             <Accordion type="multiple" className="w-full space-y-6">
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
                             <CardDescription>Manually send comments & change modes.</CardDescription>
                        </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                        <DevTools 
                          onManualComment={handleManualComment} 
                          keywords={keywords}
                          displayMode={displayMode}
                          onModeChange={handleModeChange}
                        />
                    </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
             <div>
               <DisplayViewport 
                activeMedia={activeMedia} 
                activeTarotCard={activeTarotCard}
                displayMode={displayMode}
                carState={carState}
                mazeState={mazeState}
              />
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
      <audio ref={validMoveAudioRef} src="https://actions.google.com/sounds/v1/events/positive_feedback.ogg" />
      <audio ref={invalidMoveAudioRef} src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" />
    </div>
  );
}

  

    