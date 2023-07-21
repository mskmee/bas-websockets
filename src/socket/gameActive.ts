import { Server } from 'socket.io';
import { app } from '../app';

export default (io: Server) => {
  io.on('connect', (socket) => {
    socket.on('change-user-status', (title: string, user: string) => {
      const updateStatus = app.changeUserReadyStatus(title, user);
      io.to(title).emit('update-user-status', updateStatus);
      const room = app.getRoomByTitle(title);
    });
  });
};
