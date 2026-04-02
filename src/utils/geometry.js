/**
 * Utility functions for calculating and drawing geometric shapes on the canvas.
 * * Note: For these functions to work, your Canvas component must pass the 
 * ORIGINAL starting coordinate of the mouse down event (startX, startY), 
 * not the coordinate from the previous millisecond.
 */

/**
 * Calculates the exact distance between two coordinates using the Pythagorean theorem.
 * Useful for finding the radius of a circle.
 */
export const calculateDistance = (x0, y0, x1, y1) => {
  return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
};

/**
 * Draws a perfect circle.
 * The starting click is the center, and the drag distance is the radius.
 */
export const drawCircle = (ctx, startX, startY, currentX, currentY) => {
  const radius = calculateDistance(startX, startY, currentX, currentY);
  
  ctx.beginPath();
  ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
};

/**
 * Draws a rectangle.
 * Calculates the dynamic width and height based on the drag distance.
 */
export const drawRectangle = (ctx, startX, startY, currentX, currentY) => {
  const width = currentX - startX;
  const height = currentY - startY;
  
  ctx.beginPath();
  // ctx.rect(x, y, width, height)
  ctx.rect(startX, startY, width, height);
  ctx.stroke();
  ctx.closePath();
};

/**
 * Draws a perfectly straight line from point A to point B.
 */
export const drawStraightLine = (ctx, startX, startY, currentX, currentY) => {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();
  ctx.closePath();
};
