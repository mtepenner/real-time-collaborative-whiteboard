# 🎨 SyncBoard (Frontend Client)

A lightning-fast, real-time collaborative whiteboard application built with React and the HTML5 Canvas API. SyncBoard allows multiple users to draw, sketch, and wireframe together in real-time with zero latency.

> **Note:** This repository contains the client-side React application. It requires the [SyncBoard Node.js Backend](#) to function as a multiplayer experience.

## ✨ Features

* **Real-Time Collaboration:** Powered by WebSockets for instant, lag-free syncing across all connected clients.
* **Multiplayer Presence:** See who is currently in the room and watch their custom cursors move in real-time.
* **Room Isolation:** Users are grouped into specific board URLs (e.g., `/board/123`), ensuring drawings don't overlap between different teams.
* **Advanced Drawing Tools:** Supports freehand drawing, erasing, and geometric shapes (straight lines, rectangles, circles).
* **High-Performance Rendering:** Uses `Zustand` for global UI state and a dual-canvas "draft layer" system to prevent DOM re-renders and shape smearing.
* **Responsive UI:** Clean, modern interface built with Tailwind CSS and Lucide icons.

## 🛠 Tech Stack

* **Framework:** React 18 (Bootstrapped with Vite for instant server start)
* **Styling:** Tailwind CSS
* **State Management:** Zustand (Global store) & React Context (Auth/Sockets)
* **Real-Time Engine:** Socket.io-client
* **Icons:** Lucide React
* **Routing:** React Router v6

## 📂 Project Architecture

```text
src/
├── assets/          # Static SVGs, cursors, and background patterns
├── components/      
│   ├── Canvas/      # Dual-canvas drawing engine and event handling
│   ├── Room/        # Multiplayer features (PresenceRow, RemoteCursors)
│   ├── Toolbar/     # Tool selection, color picker, thickness slider
│   └── UI/          # Reusable design system components (Buttons, Modals)
├── contexts/        # React Context providers (AuthContext, SocketContext)
├── hooks/           # Custom logic (useDraw, useSocketListener)
├── pages/           # High-level route views (Home, Dashboard, Board)
├── store/           # Zustand global state (useBoardStore)
└── utils/           # Helper functions (Math for geometry/shapes)
```

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16 or higher) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/syncboard-client.git](https://github.com/yourusername/syncboard-client.git)
   cd syncboard-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Environment Variables:
   Create a `.env` file in the root directory and add the URL of your Node.js backend.
   ```env
   VITE_BACKEND_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

## 🧠 Core Engineering Concepts

### The "Draft Canvas" System
Drawing geometric shapes requires a starting coordinate and an ending coordinate. To prevent the "smear" effect while a user is dragging their mouse, SyncBoard uses two overlapping HTML canvases:
1. **Draft Canvas (Top):** Invisible layer that captures mouse events. Clears and redraws the shape every millisecond while the user is actively dragging.
2. **Main Canvas (Bottom):** The persistent layer. The final shape is only committed here (and broadcast to the server) once the user releases the mouse.

### Optimized State Management
Real-time drawing fires hundreds of mouse events per second. SyncBoard actively bypasses React's render cycle for drawing actions by using `useRef` and direct Canvas API manipulation. Global UI state (colors, active tools) is handled by Zustand to ensure that changing a color doesn't trigger a re-render of the heavy canvas component.

## 📜 Available Scripts

* `npm run dev`: Starts the Vite development server.
* `npm run build`: Bundles the app into static files for production.
* `npm run preview`: Bootstraps a local static web server to test the production build.
* `npm run lint`: Runs ESLint to catch code issues.
