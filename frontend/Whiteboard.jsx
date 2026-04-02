import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connect to your local Node/Express backend
const socket = io('http://localhost:3001'); 

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  
  // Track if the user is currently holding down the mouse
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Track the last known X/Y coordinates to draw continuous lines
  const currentPos = useRef({ x: 0, y: 0 });
  const currentColor = useRef('black'); // You could connect this to a UI color picker

  useEffect(() => {
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to fill the screen
    // Multiplying by 2 handles high-DPI (Retina) displays so lines aren't blurry
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 5;
    contextRef.current = context;

    // --- SOCKET LISTENER: Incoming drawings from other users ---
    const onDrawingEvent = (data) => {
      const w = canvas.width / 2;
      const h = canvas.height / 2;
      
      // Calculate exact coordinates based on percentages to handle different screen sizes
      drawLine(
        data.x0 * w, 
        data.y0 * h, 
        data.x1 * w, 
        data.y1 * h, 
        data.color, 
        false // Do not emit this back to the server!
      );
    };

    socket.on('draw-update', onDrawingEvent);

    // Cleanup listener on unmount
    return () => {
      socket.off('draw-update', onDrawingEvent);
    };
  }, []);

  // --- DRAWING LOGIC ---
  const drawLine = (x0, y0, x1, y1, color, emit) => {
    const context = contextRef.current;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.stroke();
    context.closePath();

    if (!emit) return; // If it's a remote drawing, stop here.

    // If it's a local drawing, emit the coordinates to the backend
    const canvas = canvasRef.current;
    const w = canvas.width / 2;
    const h = canvas.height / 2;

    socket.emit('draw', {
      x0: x0 / w, // Send as percentages so it scales on other users' screens
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color
    });
  };

  // --- MOUSE EVENT HANDLERS ---
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    currentPos.current = { x: offsetX, y: offsetY };
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    
    // Draw the line from the last known position to the current position
    drawLine(
      currentPos.current.x, 
      currentPos.current.y, 
      offsetX, 
      offsetY, 
      currentColor.current, 
      true
    );
    
    // Update the last known position
    currentPos.current = { x: offsetX, y: offsetY };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div style={{ overflow: 'hidden', height: '100vh', width: '100vw' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing} // Stop drawing if the mouse leaves the canvas
        style={{ cursor: 'crosshair', backgroundColor: '#f0f0f0' }}
      />
    </div>
  );
};

export default Whiteboard;
