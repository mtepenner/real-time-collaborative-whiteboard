import { create } from 'zustand';

/**
 * Zustand Global State Store for Whiteboard Tools
 * * This store manages the ephemeral UI state of the drawing tools.
 * By keeping this state out of the Canvas component's local state,
 * we prevent unnecessary and expensive re-renders of the HTML canvas 
 * every time a user changes a color or selects a different brush.
 */
export const useBoardStore = create((set) => ({
  // --- STATE ---
  
  // The currently active drawing tool ('pen' | 'eraser')
  // You can expand this later to include 'line', 'rectangle', 'text', etc.
  tool: 'pen', 
  
  // The currently selected stroke color (Hex format)
  color: '#000000', 
  
  // The thickness of the stroke in pixels
  lineWidth: 5,     

  // --- ACTIONS ---

  /**
   * Updates the active drawing tool.
   * @param {string} newTool - The tool identifier (e.g., 'pen')
   */
  setTool: (newTool) => set({ tool: newTool }),

  /**
   * Updates the active color. 
   * Note: The Canvas component will ignore this if the 'eraser' tool is active.
   * @param {string} newColor - The hex color code
   */
  setColor: (newColor) => set({ color: newColor }),

  /**
   * Updates the thickness of the drawing line.
   * @param {number} newWidth - The width in pixels
   */
  setLineWidth: (newWidth) => set({ lineWidth: newWidth }),

  /**
   * Utility action to reset the tool state back to defaults
   * Useful for when a user leaves a room or creates a new board.
   */
  resetTools: () => set({
    tool: 'pen',
    color: '#000000',
    lineWidth: 5
  })
}));
