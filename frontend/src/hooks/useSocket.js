import { useEffect } from 'react';
import { useSocket as useGlobalSocket } from '../contexts/SocketContext';

/**
 * A custom hook to safely listen to Socket.io events and automatically clean them up.
 * * @param {string} eventName - The name of the socket event to listen for (e.g., 'draw-update')
 * @param {function} callback - The function to run when the event is received
 */
export const useSocketListener = (eventName, callback) => {
  const socket = useGlobalSocket();

  useEffect(() => {
    // If the socket connection hasn't been established yet, do nothing
    if (!socket) return;

    // Attach the event listener
    socket.on(eventName, callback);

    // CLEANUP: When the component unmounts (or dependencies change),
    // immediately remove this specific listener to prevent duplicate firing.
    return () => {
      socket.off(eventName, callback);
    };
  }, [socket, eventName, callback]); 
};
