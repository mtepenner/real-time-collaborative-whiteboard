import React, { useState, useEffect } from 'react';
import { useSocketListener } from '../../hooks/useSocket';

const RemoteCursors = () => {
  const [cursors, setCursors] = useState({});

  // Listen for cursor updates from the server
  // Expected data: { userId, x, y, name, color }
  useSocketListener('cursor-update', (data) => {
    setCursors((prev) => ({
      ...prev,
      [data.userId]: {
        x: data.x * window.innerWidth,   // Convert back from percentages
        y: data.y * window.innerHeight,
        name: data.name,
        color: data.color || '#3b82f6', // Default blue
        lastUpdate: Date.now()
      }
    }));
  });

  // Cleanup loop: Remove cursors if the user hasn't moved their mouse in 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCursors((prev) => {
        const activeCursors = { ...prev };
        Object.keys(activeCursors).forEach((userId) => {
          if (now - activeCursors[userId].lastUpdate > 3000) {
            delete activeCursors[userId];
          }
        });
        return activeCursors;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none z-20"
    >
      {Object.entries(cursors).map(([userId, cursor]) => (
        <div
          key={userId}
          className="absolute top-0 left-0 transition-transform duration-75 ease-linear pointer-events-none"
          style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
        >
          {/* Custom SVG Cursor */}
          <svg
            width="24"
            height="36"
            viewBox="0 0 24 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
          >
            <path
              d="M5.65376 21.0069L2.52044 2.80281C2.10651 0.40026 4.88725 -1.14449 6.81804 0.414002L21.7247 12.4468C23.5186 13.8946 22.8465 16.7456 20.5702 17.3402L13.8569 19.0934L11.0825 25.6881C10.2241 27.7285 7.23467 27.054 7.02706 24.8785L5.65376 21.0069Z"
              fill={cursor.color}
              stroke="white"
              strokeWidth="2"
            />
          </svg>
          
          {/* Name Tag */}
          <div 
            className="ml-5 mt-1 px-2 py-0.5 text-xs text-white rounded-md shadow-sm whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RemoteCursors;
