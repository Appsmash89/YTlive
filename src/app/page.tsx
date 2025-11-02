"use client";

import Header from '@/components/layout/header';
import ControlSidebar from '@/components/layout/control-sidebar';
import CommentFeed from '@/components/comment-feed';
import CommandLogDisplay from '@/components/command-log';
import DisplayViewport from '@/components/display-viewport';
import { useGameEngine } from '@/hooks/use-game-engine';

export default function Home() {
  const gameEngine = useGameEngine();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-6">
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
            <ControlSidebar
              isStreaming={gameEngine.isStreaming}
              onToggleStreaming={gameEngine.toggleStreaming}
              keywords={gameEngine.keywords}
              onAddKeyword={gameEngine.addKeyword}
              onRemoveKeyword={gameEngine.removeKeyword}
              onManualComment={gameEngine.handleNewComment}
              displayMode={gameEngine.displayMode}
              onModeChange={gameEngine.changeDisplayMode}
            />
          </div>
          <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
            <div>
              <DisplayViewport
                displayMode={gameEngine.displayMode}
                activeMedia={gameEngine.activeMedia}
                activeTarotCard={gameEngine.activeTarotCard}
                carState={gameEngine.carState}
                mazeState={gameEngine.mazeState}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[300px]">
              <div className="flex flex-col">
                <CommentFeed
                  onNewComment={gameEngine.handleNewComment}
                  isStreaming={gameEngine.isStreaming}
                  isProcessing={gameEngine.isProcessing}
                />
              </div>
              <div className="flex flex-col">
                <CommandLogDisplay history={gameEngine.commandHistory} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
