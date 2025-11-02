"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import type {
  Comment,
  CommandLog,
  DisplayMode,
  TarotCard,
  CarState,
  MazeState,
  ActiveMedia,
} from '@/lib/types';
import { generateMockComment } from '@/lib/mock-data';
import { mediaMap } from '@/lib/media';
import { tarotCards } from '@/lib/tarot-cards';
import { generateMaze } from '@/lib/maze';
import {
  INITIAL_KEYWORDS,
  MAZE_COLS,
  MAZE_ROWS,
  KEYWORDS_MAP
} from '@/lib/constants';
import { fetchLiveChatMessages } from '@/lib/youtube';

const INITIAL_MAZE_STATE = generateMaze(MAZE_ROWS, MAZE_COLS);

export function useGameEngine() {
  const [keywords, setKeywords] = useState<string[]>(INITIAL_KEYWORDS);
  const [commandHistory, setCommandHistory] = useState<CommandLog[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('fastfood');
  
  const [youtubeVideoId, setYoutubeVideoId] = useState<string>('');
  const [liveChatId, setLiveChatId] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout>();
  const pageTokenRef = useRef<string | undefined>();
  const seenCommentIds = useRef(new Set());

  const [activeMedia, setActiveMedia] = useState<ActiveMedia | null>(null);
  const [activeTarotCard, setActiveTarotCard] = useState<TarotCard | null>(null);
  const [carState, setCarState] = useState<CarState>({ position: 'center', speed: 'stopped' });
  const [mazeState, setMazeState] = useState<MazeState>(INITIAL_MAZE_STATE);

  const { toast } = useToast();

  useEffect(() => {
    if (mazeState.isComplete) {
      toast({
        title: "Puzzle Complete!",
        description: "A new maze has been generated.",
      });
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

  const handleNewComment = useCallback(async (commentOrText: Comment | string) => {
    const comment = typeof commentOrText === 'string' ? generateMockComment(commentOrText) : commentOrText;
    
    setIsProcessing(true);

    let result: { command: string | undefined, feedback: string | undefined } = { command: undefined, feedback: 'No command detected' };

    if (displayMode === 'tarot') {
      const tarotResult = getRandomTarotCard();
      setActiveTarotCard(tarotResult.card);
      setActiveMedia({ url: '', type: '', command: 'tarot', authorName: comment.author.name });
      result = { command: 'tarot-draw', feedback: tarotResult.feedback };
    } else if (displayMode === 'drive') {
      result = analyzeComment(comment.text, KEYWORDS_MAP.drive);
      if (result.command) {
        setCarState(prevState => {
          let { position, speed } = prevState;
          if (result.command === 'left') position = 'left';
          else if (result.command === 'right') position = 'right';
          else if (result.command === 'forward') { speed = 'moving'; position = 'center'; }
          else if (result.command === 'stop') speed = 'stopped';
          return { position, speed };
        });
      }
    } else if (displayMode === 'findway') {
      result = analyzeComment(comment.text, KEYWORDS_MAP.findway);
      if (result.command) {
        setMazeState(prevState => {
          if (prevState.isComplete) return prevState;

          const { maze, playerPosition } = prevState;
          let { row, col } = playerPosition;
          let newRow = row, newCol = col;

          if (result.command === 'up' && row > 0 && maze[row - 1][col] !== 'wall') newRow--;
          else if (result.command === 'down' && row < maze.length - 1 && maze[row + 1][col] !== 'wall') newRow++;
          else if (result.command === 'left' && col > 0 && maze[row][col - 1] !== 'wall') newCol--;
          else if (result.command === 'right' && col < maze[0].length - 1 && maze[row][col + 1] !== 'wall') newCol++;
          
          const newPosition = { row: newRow, col: newCol };
          
          const isComplete = newPosition.row >= 0 && newPosition.row < prevState.maze.length &&
                               newPosition.col >= 0 && newPosition.col < prevState.maze[0].length &&
                               prevState.maze[newPosition.row][newPosition.col] === 'end';
          
          return { ...prevState, playerPosition: newPosition, isComplete };
        });
      }
    } else { // FastFood mode
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

  const pollComments = useCallback(async (chatId: string) => {
    console.log("Polling for comments...");
    try {
      const result = await fetchLiveChatMessages({
        liveChatId: chatId,
        pageToken: pageTokenRef.current,
      });

      if (result && result.comments) {
        for (const comment of result.comments) {
          if (!seenCommentIds.current.has(comment.id)) {
            seenCommentIds.current.add(comment.id);
            handleNewComment(comment);
          }
        }
        pageTokenRef.current = result.nextPageToken;
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch comments",
        description: "Could not connect to YouTube. Please check the video ID and your API key.",
      });
      toggleStreaming(false); // Stop streaming on error
    }
  }, [handleNewComment, toast]);
  
  const toggleStreaming = useCallback((forceState?: boolean) => {
    setIsStreaming(current => {
      const nextState = typeof forceState === 'boolean' ? forceState : !current;
      if (nextState) { // If turning on
        if (!youtubeVideoId) {
          toast({
            variant: "destructive",
            title: "YouTube Video ID missing",
            description: "Please enter a YouTube Live Video ID to start streaming.",
          });
          return false;
        }
        // Start polling logic
        console.log(`Starting stream for video ID: ${youtubeVideoId}`);
        // Reset state for new stream
        pageTokenRef.current = undefined;
        seenCommentIds.current.clear();
        setCommandHistory([]);
        
        // This is where you would get the liveChatId from the videoId
        // For now, we'll simulate it. In a real app, this would be an API call.
        const mockLiveChatId = 'mock-chat-id-for-' + youtubeVideoId;
        setLiveChatId(mockLiveChatId);

        pollComments(mockLiveChatId); // Poll immediately
        pollingIntervalRef.current = setInterval(() => pollComments(mockLiveChatId), 5000);

      } else { // If turning off
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = undefined;
        }
        console.log("Stopping stream");
      }
      return nextState;
    });
  }, [youtubeVideoId, toast, pollComments]);
  
  const addKeyword = (keyword: string) => {
    const newKeyword = keyword.trim().toLowerCase();
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords(prev => [...prev, newKeyword]);
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(prev => prev.filter(k => k !== keywordToRemove));
  };
  
  const changeDisplayMode = (mode: DisplayMode) => {
    setDisplayMode(mode);
    setActiveMedia(null);
    setActiveTarotCard(null);
    setCarState({ position: 'center', speed: 'stopped' });
    if (mode === 'findway') {
      setMazeState(generateMaze(MAZE_ROWS, MAZE_COLS));
    }
  };

  return {
    keywords,
    commandHistory,
    isStreaming,
    isProcessing,
    displayMode,
    activeMedia,
    activeTarotCard,
    carState,
    mazeState,
    youtubeVideoId,
    setYoutubeVideoId,
    addKeyword,
    removeKeyword,
    handleNewComment,
    changeDisplayMode,
    toggleStreaming,
  };
}
