
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
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full">
          <div className="md:col-span-4 lg:col-span-3 h-full overflow-y-auto p-4 md:p-6 border-r">
            <ControlSidebar
              streamStatus={gameEngine.streamStatus}
              onToggleStreaming={gameEngine.toggleStreaming}
              keywords={gameEngine.keywords}
              onAddKeyword={gameEngine.addKeyword}
              onRemoveKeyword={gameEngine.removeKeyword}
              onManualComment={gameEngine.handleNewComment}
              displayMode={gameEngine.displayMode}
              onModeChange={gameEngine.changeDisplayMode}
              youtubeVideoId={gameEngine.youtubeVideoId}
              onYoutubeVideoIdChange={gameEngine.setYoutubeVideoId}
            />
          </div>
          <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6 p-4 md:p-6 h-full overflow-hidden">
            <div className="flex-[2_2_0%]">
              <DisplayViewport
                displayMode={gameEngine.displayMode}
                activeMedia={gameEngine.activeMedia}
                activeTarotCard={gameEngine.activeTarotCard}
                carState={gameEngine.carState}
                mazeState={gameEngine.mazeState}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-[1_1_0%] min-h-0">
              <div className="flex flex-col h-full">
                <CommentFeed
                  onNewComment={gameEngine.handleNewComment}
                  isStreaming={gameEngine.isStreaming}
                  isProcessing={gameEngine.isProcessing}
                />
              </div>
              <div className="flex flex-col h-full">
                <CommandLogDisplay history={gameEngine.commandHistory} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
