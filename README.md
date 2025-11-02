> **Gemini**: Always review this document thoroughly before making any changes to ensure you have a complete understanding of the project architecture, logic, and design goals.

# Stream Control AI - Project Documentation

## 1. Project Overview

Stream Control AI is an interactive Next.js web application designed to allow a live streaming audience to control on-screen elements using chat comments. It features multiple "display modes," each offering a unique interactive experience, from controlling a car in a game to revealing tarot cards. The application is built to be modular and extensible, allowing for new modes and features to be added easily.

The interface is divided into three main sections:
1.  **Control Sidebar:** Where the streamer can configure settings, manage keywords, and simulate comments.
2.  **Display Viewport:** The main screen where the interactive content is shown to the audience.
3.  **Logs:** A section displaying the incoming comment feed and a log of executed commands.

---

## 2. App Architecture

The application is built with a modern, client-side focused tech stack, prioritizing modularity and separation of concerns.

### 2.1. Tech Stack

- **Framework:** Next.js (with App Router)
- **Language:** TypeScript
- **UI:** React, ShadCN UI Components
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion

### 2.2. Folder Structure

The `src` directory is organized to maintain a clear separation of concerns:

- `src/app/`: Contains the main entry point (`page.tsx`) and global layout (`layout.tsx`).
- `src/components/`: Contains all React components, organized into subdirectories:
  - `ui/`: Core ShadCN UI components (Button, Card, etc.).
  - `layout/`: Components that structure the main application layout (Header, ControlSidebar).
  - `Other Components`: Feature-specific components like `CommentFeed`, `DisplayViewport`, etc.
- `src/hooks/`: Houses custom React hooks that contain the majority of the application's business logic.
  - `useGameEngine.ts`: The central hook that manages all application state and logic.
- `src/lib/`: Contains utility functions, static data, type definitions, and constants.
  - `types.ts`: Defines all TypeScript types used across the application.
  - `constants.ts`: Global constants like maze dimensions and keyword mappings.
  - `media.ts`, `tarot-cards.ts`, `maze.ts`: Modules for loading and handling data for different modes.

---

## 3. State Management (`useGameEngine`)

The core of the application's interactivity is managed by the `useGameEngine` custom hook (`src/hooks/use-game-engine.ts`). This hook acts as a centralized state machine for the entire app, handling all state changes and game logic.

### 3.1. Managed State

- `displayMode`: The currently active mode (`fastfood`, `tarot`, `drive`, `findway`).
- `keywords`: A list of custom keywords for command recognition.
- `commandHistory`: A log of all comments processed and the commands that were executed.
- `isStreaming`: A boolean to toggle the simulated comment feed.
- `isProcessing`: A boolean that indicates when a comment is being analyzed.
- `activeMedia`: State for the "FastFood" mode, holding the currently displayed image.
- `activeTarotCard`: State for the "Tarot" mode, holding the currently drawn card.
- `carState`: State for the "Drive" mode, managing the car's position and speed.
- `mazeState`: State for the "Find Way" mode, managing the maze grid, player position, and completion status.

### 3.2. Core Logic

- **`handleNewComment`**: The central function that processes incoming comments. It analyzes the comment text based on the current `displayMode`, updates the appropriate state (e.g., moves the car, updates the maze), and logs the command.
- **Mode-Specific Logic**: The hook contains separate logic paths for each display mode, ensuring that commands are interpreted correctly. For example, "left" moves the car in "Drive" mode but moves the marble in "Find Way" mode.
- **State Updaters**: Functions like `addKeyword`, `removeKeyword`, and `changeDisplayMode` provide safe ways to modify the game state from the UI.

---

## 4. Display Modes

The application features several distinct interactive modes, which can be switched from the "Dev Tools" panel.

### 4.1. FastFood Mode

- **Concept:** A simple keyword-matching game.
- **Logic:** Comments are scanned for keywords like "pizza", "burger", etc. (defined in `src/lib/media.ts`). If a match is found, a corresponding image is displayed in the viewport.
- **Component:** `DisplayViewport` renders the image from the `activeMedia` state.

### 4.2. Tarot Mode

- **Concept:** A virtual tarot card reading.
- **Logic:** Any incoming comment triggers a random tarot card to be "drawn" from the deck defined in `src/lib/tarot-cards.ts`.
- **Component:** `DisplayViewport` has a special layout for this mode, displaying the card's image, name, meanings, and other details from the `activeTarotCard` state.

### 4.3. Drive Mode

- **Concept:** An interactive driving animation.
- **Logic:** User comments containing "left", "right", "forward", and "stop" control a car on an animated, endless road.
- **Component:** `DriveAnimation.tsx` uses CSS animations and transitions to create the visual effect. The `carState` object determines the car's position (`left`, `center`, `right`) and speed (`moving`, `stopped`).

### 4.4. Find Way Mode

- **Concept:** A maze puzzle game.
- **Logic:** Users guide a marble through a randomly generated maze using "up", "down", "left", and "right" commands. The maze is generated using a recursive backtracking algorithm in `src/lib/maze.ts`. When the marble reaches the "end" cell, the puzzle is complete, and a new maze is generated.
- **Component:** `FindWayPuzzle.tsx` renders the maze grid and animates the player's marble using Framer Motion.

---

## 5. Components Deep Dive

### 5.1. `ControlSidebar`

- **Purpose:** The main interactive panel for the streamer.
- **Structure:** Uses an accordion layout to separate different control sections.
- **Sections:**
  - **Stream Controls:** Contains the (currently simulated) stream URL input and a switch to toggle the mock comment feed.
  - **Keyword Recognition:** Allows the streamer to add or remove custom keywords for the "FastFood" mode.
  - **Dev Tools:** Provides tools for development and testing, including a radio group to switch the `displayMode` and a text area to manually send comments.

### 5.2. `DisplayViewport`

- **Purpose:** The main visual output of the application.
- **Logic:** It conditionally renders different content based on the current `displayMode` and the corresponding active state (`activeMedia`, `activeTarotCard`, `carState`, `mazeState`). Framer Motion (`AnimatePresence`) is used to create smooth transitions between different content.

### 5.3. `CommentFeed` & `CommandLogDisplay`

- **`CommentFeed`:** Simulates a live chat. It generates mock comments at a set interval when `isStreaming` is true. When a new comment is generated, it calls the `handleNewComment` function passed down from the main page.
- **`CommandLogDisplay`:** Renders a history of all processed commands, showing the original comment, the detected command, and a timestamp. This provides clear feedback on what the application is doing.

This document will be updated after every significant change to ensure it remains an accurate and valuable resource for our development process.