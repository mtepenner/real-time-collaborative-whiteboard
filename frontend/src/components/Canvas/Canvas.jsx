import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useBoardStore } from '../../store/useBoardStore';
import { useSocketListener } from '../../hooks/useSocket';
import { drawCircle, drawRectangle, drawStraightLine } from '../../utils/geometry';

// 1. IMPORT YOUR CUSTOM CURSORS
import penCursor from '../../assets/cursors/pen.svg';
import eraserCursor from '../../assets/cursors/eraser.svg';

const Canvas = () => {
  const mainCanvasRef = useRef(null);
  const draftCanvasRef = useRef(null);
  const socket = useSocket();
  
  const { tool, color, lineWidth } = useBoardStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const startPoint = useRef(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    const setupCanvas = (canvas) => {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext('2d');
      ctx.scale(2, 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    setupCanvas(mainCanvasRef.current);
    setupCanvas(draftCanvasRef.current);

    const handleResize = () => {
      setupCanvas(mainCanvasRef.current);
      setupCanvas(draftCanvasRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- INCOMING SOCKET EVENTS ---
  const onIncomingDraw = useCallback((data) => {
    if (!mainCanvasRef.current) return;
    const ctx = mainCanvasRef.current.getContext('2d');
    const w = mainCanvasRef.current.width / 2;
    const h = mainCanvasRef.current.height / 2;
    
    executeDraw(
      ctx,
      data.x0 * w, data.y0 * h, 
      data.x1 * w, data.y1 * h, 
      data.color, data.lineWidth, data.tool
    );
  }, []);

  useSocketListener('draw-update', onIncomingDraw);

  // --- CORE DRAWING ENGINE ---
  const executeDraw = (ctx, x0, y0, x1, y1, strokeColor, strokeWidth, activeTool) => {
    // If erasing, draw with a fully transparent color (requires 'destination-out' composite operation)
    // Or, match the background color if you aren't using a transparent canvas
    ctx.strokeStyle = activeTool === 'eraser' ? '#f8fafc' : strokeColor; 
    ctx.lineWidth = strokeWidth;

    if (activeTool === 'pen' || activeTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.closePath();
    } else if (activeTool === 'rectangle') {
      drawRectangle(ctx, x0, y0, x1, y1);
    } else if (activeTool === 'circle') {
      drawCircle(ctx, x0, y0, x1, y1);
    } else if (activeTool === 'line') {
      drawStraightLine(ctx, x0, y0, x1, y1);
    }
  };

  const emitDrawEvent = (x0, y0, x1, y1) => {
    if (!socket) return;
    const w = mainCanvasRef.current.width / 2;
    const h = mainCanvasRef.current.height / 2;

    socket.emit('draw', {
      x0: x0 / w, y0: y0 / h, 
      x1: x1 / w, y1: y1 / h,
      color, lineWidth, tool
    });
  };

  // --- MOUSE INTERACTIONS ---
  const handleMouseDown = (e) => {
    setIsDrawing(true);
    startPoint.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const currentX = e.nativeEvent.offsetX;
    const currentY = e.nativeEvent.offsetY;
    const draftCtx = draftCanvasRef.current.getContext('2d');
    const mainCtx = mainCanvasRef.current.getContext('2d');

    if (tool === 'pen' || tool === 'eraser') {
      executeDraw(mainCtx, startPoint.current.x, startPoint.current.y, currentX, currentY, color, lineWidth, tool);
      emitDrawEvent(startPoint.current.x, startPoint.current.y, currentX, currentY);
      startPoint.current = { x: currentX, y: currentY };
    } else {
      draftCtx.clearRect(0, 0, draftCanvasRef.current.width, draftCanvasRef.current.height);
      executeDraw(draftCtx, startPoint.current.x, startPoint.current.y, currentX, currentY, color, lineWidth, tool);
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (tool !== 'pen' && tool !== 'eraser') {
      const endX = e.nativeEvent.offsetX;
      const endY = e.nativeEvent.offsetY;
      const draftCtx = draftCanvasRef.current.getContext('2d');
      const mainCtx = mainCanvasRef.current.getContext('2d');

      draftCtx.clearRect(0, 0, draftCanvasRef.current.width, draftCanvasRef.current.height);
      executeDraw(mainCtx, startPoint.current.x, startPoint.current.y, endX, endY, color, lineWidth, tool);
      emitDrawEvent(startPoint.current.x, startPoint.current.y, endX, endY);
    }
    
    startPoint.current = null;
  };

  // 2. DETERMINE THE ACTIVE CURSOR
  // The '0 24' sets the exact pixel (bottom-left) of the SVG that registers the click
  const activeCursor = tool === 'eraser' 
    ? `url(${eraserCursor}) 0 24, crosshair` 
    : `url(${penCursor}) 0 24, crosshair`;

  return (
    // Apply the dynamic style here
    <div 
      className="relative w-full h-full"
      style={{ cursor: activeCursor }}
    >
      {/* 3. APPLY THE GRID PATTERN TO THE MAIN CANVAS */}
      <canvas
        ref={mainCanvasRef}
        className="absolute inset-0 bg-grid-pattern touch-none"
      />
      
      {/* Draft Layer for Shapes */}
      <canvas
        ref={draftCanvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        className="absolute inset-0 bg-transparent touch-none z-10"
      />
    </div>
  );
};

export default Canvas;
