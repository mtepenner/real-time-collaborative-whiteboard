import React from 'react';
import { useBoardStore } from '../../store/useBoardStore';
import { Pencil, Eraser, Square, Circle, Minus } from 'lucide-react';

const Toolbar = () => {
  const { tool, setTool, color, setColor, lineWidth, setLineWidth } = useBoardStore();

  // Helper component for tool buttons to keep the JSX clean
  const ToolButton = ({ icon: Icon, toolName, label }) => {
    const isActive = tool === toolName;
    return (
      <button 
        onClick={() => setTool(toolName)}
        title={label}
        className={`p-2.5 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-blue-100 text-blue-700 shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Tools Panel */}
      <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-100 flex flex-col gap-1 w-max z-10 pointer-events-auto">
        <ToolButton icon={Pencil} toolName="pen" label="Freehand Pen" />
        <ToolButton icon={Eraser} toolName="eraser" label="Eraser" />
        
        <div className="w-full h-px bg-gray-200 my-1"></div>
        
        <ToolButton icon={Minus} toolName="line" label="Straight Line" />
        <ToolButton icon={Square} toolName="rectangle" label="Rectangle" />
        <ToolButton icon={Circle} toolName="circle" label="Circle" />
      </div>

      {/* Properties Panel (Colors & Size) */}
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center gap-4 w-max z-10 pointer-events-auto">
        {/* Color Picker: Hidden visually to replace with a custom circle, but keeps native functionality */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 shadow-inner group">
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            disabled={tool === 'eraser'}
            className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Thickness Slider */}
        <div className="flex flex-col items-center gap-2">
          <div 
            className="rounded-full bg-gray-800 transition-all" 
            style={{ width: `${lineWidth}px`, height: `${lineWidth}px`, backgroundColor: tool === 'eraser' ? '#e5e7eb' : color }}
          ></div>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={lineWidth} 
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-24 -rotate-90 origin-center translate-y-10 accent-blue-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
