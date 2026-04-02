import { useRef, useState, useEffect } from 'react';

export const useDraw = (onDraw) => {
  const canvasRef = useRef(null);
  const prevPoint = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const onMouseDown = (e) => {
    setIsDrawing(true);
    // Capture the exact starting coordinates relative to the canvas element
    prevPoint.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  };

  const onMouseMove = (e) => {
    if (!isDrawing) return;

    const currentPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    const ctx = canvasRef.current?.getContext('2d');

    if (!ctx || !prevPoint.current) return;

    // Pass the context and coordinates back to the component that called this hook
    onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
    
    // Update the previous point so the next line segment starts where this one ended
    prevPoint.current = currentPoint;
  };

  const onMouseUp = () => {
    setIsDrawing(false);
    prevPoint.current = null;
  };

  // Safety net: If the user clicks, drags outside the browser window, and releases, 
  // the canvas won't receive the 'onMouseUp' event. This global listener fixes that.
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDrawing(false);
      prevPoint.current = null;
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return {
    canvasRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    isDrawing
  };
};
