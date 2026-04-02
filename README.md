# SyncBoard 🚀

SyncBoard is a lightning-fast, collaborative workspace designed for remote teams who need to brainstorm and visualize ideas in real-time. Built with WebSockets, it provides an infinite canvas where multiple users can draw, create shapes, and see each other's cursors instantly without any lag.

## 📋 Table of Contents

  * [Features](https://www.google.com/search?q=%23-features)
  * [Technologies Used](https://www.google.com/search?q=%23-technologies-used)
  * [Installation](https://www.google.com/search?q=%23%25EF%25B8%258F-installation)
  * [Usage](https://www.google.com/search?q=%23-usage)
  * [Contributing](https://www.google.com/search?q=%23-contributing)
  * [License](https://www.google.com/search?q=%23-license)

## ✨ Features

  * **Real-Time Collaboration**: See team members' cursors and drawing updates instantly using Socket.io.
  * **Multiplayer Presence**: Active user badges and real-time room updates showing who is currently on the board.
  * **Diverse Drawing Tools**: Includes a freehand pen, eraser, and geometric shape tools for rectangles, circles, and straight lines.
  * **Infinite Canvas**: A dot-grid patterned workspace that allows for expansive brainstorming.
  * **Secure Workspaces**: User authentication and private dashboard to manage multiple boards.
  * **Instant Sharing**: Generate and copy board links to invite collaborators with one click.

## 🛠️ Technologies Used

### Frontend

  * **React**: UI library for building the interactive workspace.
  * **Zustand**: Lightweight state management for drawing tools and UI state.
  * **Socket.io-client**: Real-time bidirectional communication.
  * **Tailwind CSS**: Utility-first CSS framework for professional styling.
  * **Lucide React**: For clean, consistent iconography.

### Backend

  * **Node.js & Express**: Robust server-side architecture.
  * **Socket.io**: Powers the real-time drawing and cursor synchronization.
  * **MongoDB & Mongoose**: Persistent storage for user profiles and board data.

## ⚙️ Installation

### Prerequisites

  * Node.js (v16 or higher)
  * MongoDB (Local or Atlas instance)

### 1\. Clone the repository

```bash
git clone https://github.com/mtepenner/real-time-collaborative-whiteboard.git
cd real-time-collaborative-whiteboard
```

### 2\. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3\. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_BACKEND_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

## 🚀 Usage

1.  **Log In**: Use the guest login or register a new account to access your dashboard.
2.  **Create a Board**: Click "New Board" from your dashboard to start a fresh workspace.
3.  **Collaborate**: Copy the URL from the "Share" button and send it to teammates.
4.  **Draw**: Select tools from the toolbar (Pen, Shapes, Eraser) and adjust colors or line thickness as needed.

## 🤝 Contributing

Contributions are welcome\! Please follow these steps:

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the **MIT License**.
