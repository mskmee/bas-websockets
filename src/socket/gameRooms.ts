import { Server } from 'socket.io';
import { app } from '../app';
import { createErrorMessage } from '../helpers/createErrorMessage';

export default (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('get-rooms', () => {
      socket.emit('rooms', app.rooms.getRooms());
    });
    socket.on('create-room', (title: string) => {
      if (!app.addRoom('id', title)) {
        socket.emit('room-error', createErrorMessage(title, true));
        return;
      }
      app.rooms.createRoom(title, socket.id);
      socket.emit('new-room', app.getRoomByTitle(title));
    });
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      socket.emit('joined-room', roomId);
    });
  });
};
