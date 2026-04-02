export const registerBoardHandlers = (io, socket) => {
  
  // 1. Handling Room Entry
  socket.on('join-room', (data) => {
    const { boardId, userName } = data;
    
    // Group this specific socket into a virtual "room"
    socket.join(boardId);
    console.log(`${userName || socket.id} joined room: ${boardId}`);

    // Optional: Notify others in the room
    socket.to(boardId).emit('user-joined', { userName });

    // Send back current user count in this room
    const roomSize = io.sockets.adapter.rooms.get(boardId)?.size || 0;
    io.to(boardId).emit('room-users-update', roomSize);
  });

  // 2. Handling Real-Time Drawing
  socket.on('draw', (data) => {
    // Extract the room from the socket's current rooms
    const rooms = Array.from(socket.rooms);
    const boardId = rooms.find(r => r !== socket.id);

    if (boardId) {
      // Broadcast the drawing data to everyone in the room EXCEPT the sender
      socket.to(boardId).emit('draw-update', data);
    }
  });

  // 3. Handling Real-Time Cursor Movement
  socket.on('cursor-move', (data) => {
    const rooms = Array.from(socket.rooms);
    const boardId = rooms.find(r => r !== socket.id);

    if (boardId) {
      socket.to(boardId).emit('cursor-update', {
        ...data,
        userId: socket.id // Identify whose cursor this is
      });
    }
  });

  // 4. Handling Room Exit
  socket.on('leave-room', (boardId) => {
    socket.leave(boardId);
    const roomSize = io.sockets.adapter.rooms.get(boardId)?.size || 0;
    io.to(boardId).emit('room-users-update', roomSize);
  });
};
