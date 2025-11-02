
> **Gemini**: Always review this document thoroughly before making any changes to ensure you have a complete understanding of the project architecture, logic, and design goals.

# Stream Control AI - Project Documentation

## 1. Project Overview

Stream Control AI is an interactive Next.js web application designed to allow a live streaming audience to control on-screen elements using chat comments. It features multiple "display modes," each offering a unique interactive experience, from controlling a car in a game to revealing tarot cards. The application is built to be modular and extensible, allowing for new modes and features to be added easily. It now connects directly to the YouTube Live API to fetch real comments.

The interface is divided into three main sections:
1.  **Control Sidebar:** Where the streamer can configure settings, connect to a YouTube stream, manage keywords, and simulate comments.
2.  **Display Viewport:** The main screen where the interactive content is shown to the audience.
3.  **Logs:** A section displaying the incoming comment feed and a log of executed commands.

---

## 2. App Architecture

The application is built with a modern, client-side focused tech stack, prioritizing modularity and separation of concerns. It uses Firebase for backend services and the YouTube Data API for live comment fetching.

### 2.1. Tech Stack

- **Framework:** Next.js (with App Router)
- **Language:** TypeScript
- **UI:** React, ShadCN UI Components
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Backend Services:** Firebase
- **API:** Google APIs (YouTube Data API v3)

### 2.2. Folder Structure

The `src` directory is organized to maintain a clear separation of concerns:

- `src/app/`: Contains the main entry point (`page.tsx`) and global layout (`layout.tsx`).
- `src/components/`: Contains all React components, organized into subdirectories:
  - `ui/`: Core ShadCN UI components (Button, Card, etc.).
  - `layout/`: Components that structure the main application layout (Header, ControlSidebar).
  - `Other Components`: Feature-specific components like `CommentFeed`, `DisplayViewport`, etc.
- `src/hooks/`: Houses custom React hooks that contain the majority of the application's business logic.
  - `useGameEngine.ts`: The central hook that manages all application state and logic.
- `src/lib/`: Contains utility functions, static data, type definitions, and service clients.
  - `types.ts`: Defines all TypeScript types used across the application.
  - `constants.ts`: Global constants like maze dimensions and keyword mappings.
  - `media.ts`, `tarot-cards.ts`, `maze.ts`: Modules for loading and handling data for different modes.
  - `youtube.ts`: A server-side module to interact with the YouTube Data API.
- `src/firebase/`: Contains all Firebase configuration and provider setup.

---

## 3. State Management (`useGameEngine`)

The core of the application's interactivity is managed by the `useGameEngine` custom hook (`src/hooks/use-game-engine.ts`). This hook acts as a centralized state machine for the entire app, handling all state changes, API interactions, and game logic.

### 3.1. Managed State

- **`displayMode`**: The currently active mode (`fastfood`, `tarot`, `drive`, `findway`).
- **`streamStatus`**: The connection status to the YouTube stream (`idle`, `connecting`, `connected`, `error`).
- **`youtubeVideoId`**: The ID of the YouTube video to fetch comments from.
- **`keywords`**: A list of custom keywords for command recognition.
- **`commandHistory`**: A log of all comments processed and the commands that were executed.
- **`isProcessing`**: A boolean that indicates when a comment is being analyzed.
- **`activeMedia`**: State for the "FastFood" mode, holding the currently displayed image.
- **`activeTarotCard`**: State for the "Tarot" mode, holding the currently drawn card.
- **`carState`**: State for the "Drive" mode, managing the car's position and speed.
- **`mazeState`**: State for the "Find Way" mode, managing the maze grid, player position, and completion status.

### 3.2. Core Logic

- **`handleNewComment`**: The central function that processes incoming comments. It analyzes the comment text based on the current `displayMode`, updates the appropriate state (e.g., moves the car, updates the maze), and logs the command.
- **YouTube API Integration**:
  - **`toggleStreaming`**, **`startStreaming`**, **`stopStreaming`**: These functions manage the connection to the YouTube live stream.
  - `startStreaming` retrieves the `liveChatId` for the given `youtubeVideoId` and initiates polling.
  - **`pollComments`**: This function periodically calls the backend service (`/lib/youtube.ts`) to fetch new chat messages. It handles pagination (`pageToken`) and ensures comments are not processed more than once.
- **Mode-Specific Logic**: The hook contains separate logic paths for each display mode, ensuring that commands are interpreted correctly. For example, "left" moves the car in "Drive" mode but moves the marble in "Find Way" mode.
- **State Updaters**: Functions like `addKeyword`, `removeKeyword`, and `changeDisplayMode` provide safe ways to modify the game state from the UI.

---

## 4. YouTube Integration (`/lib/youtube.ts`)

To securely fetch live comments, the application uses a server-side module that acts as a proxy to the YouTube Data API.

- **`getLiveChatId(videoId)`**: This function takes a YouTube video ID and returns the associated `activeLiveChatId`. This is a necessary first step before fetching messages.
- **`fetchLiveChatMessages({ liveChatId, pageToken })`**: This function fetches a list of new messages from the specified chat. It uses a `pageToken` to ensure it only gets messages since the last poll.
- **Security:** The `GOOGLE_API_KEY` is stored in an `.env` file and is only accessible on the server, making it secure and preventing exposure on the client-side. The `.gitignore` file is configured to prevent `.env` from ever being committed to the repository.

---

## 5. Display Modes

The application features several distinct interactive modes, which can be switched from the "Dev Tools" panel.

### 5.1. FastFood Mode

- **Concept:** A simple keyword-matching game.
- **Logic:** Comments are scanned for keywords like "pizza", "burger", etc. (defined in `src/lib/media.ts`). If a match is found, a corresponding image is displayed in the viewport.
- **Component:** `DisplayViewport` renders the image from the `activeMedia` state.

### 5.2. Tarot Mode

- **Concept:** A virtual tarot card reading.
- **Logic:** Any incoming comment triggers a random tarot card to be "drawn" from the deck defined in `src/lib/tarot-cards.ts`.
- **Component:** `DisplayViewport` has a special layout for this mode, displaying the card's image, name, meanings, and other details from the `activeTarotCard` state.

### 5.3. Drive Mode

- **Concept:** An interactive driving animation.
- **Logic:** User comments containing "left", "right", "forward", and "stop" control a car on an animated, endless road.
- **Component:** `DriveAnimation.tsx` uses CSS animations and transitions to create the visual effect. The `carState` object determines the car's position (`left`, `center`, `right`) and speed (`moving`, `stopped`).

### 5.4. Find Way Mode

- **Concept:** A maze puzzle game.
- **Logic:** Users guide a marble through a randomly generated maze using "up", "down", "left", and "right" commands. The maze is generated using a recursive backtracking algorithm in `src/lib/maze.ts`. When the marble reaches the "end" cell, the puzzle is complete, and a new maze is generated.
- **Component:** `FindWayPuzzle.tsx` renders the maze grid and animates the player's marble using Framer Motion.

---

## 6. Components Deep Dive

### 6.1. `ControlSidebar`

- **Purpose:** The main interactive panel for the streamer.
- **Structure:** Uses an accordion layout to separate different control sections.
- **Sections:**
  - **Stream Controls:** Contains the YouTube Stream URL/ID input and a switch to start/stop polling for live comments. It provides visual feedback on the connection status (`connecting`, `connected`, `error`).
  - **Keyword Recognition:** Allows the streamer to add or remove custom keywords for the "FastFood" mode.
  - **Dev Tools:** Provides tools for development and testing, including a radio group to switch the `displayMode` and a text area to manually send comments.

### 6.2. `DisplayViewport`

- **Purpose:** The main visual output of the application.
- **Logic:** It conditionally renders different content based on the current `displayMode` and the corresponding active state (`activeMedia`, `activeTarotCard`, `carState`, `mazeState`). Framer Motion (`AnimatePresence`) is used to create smooth transitions between different content.

### 6.3. `CommentFeed` & `CommandLogDisplay`

- **`CommentFeed`:** Displays comments received from the YouTube stream or generated manually. It shows a loading spinner when the engine is processing a command.
- **`CommandLogDisplay`:** Renders a history of all processed commands, showing the original comment, the detected command, and a timestamp. This provides clear feedback on what the application is doing.

This document will be updated after every significant change to ensure it remains an accurate and valuable resource for our development process.
