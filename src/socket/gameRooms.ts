import { Server } from 'socket.io';
import { app } from '../app';
import { createErrorMessage } from '../helpers/createErrorMessage';
import { IGameUser } from '../types/interfaces/IGameUser';

export default (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('get-rooms', () => {
      socket.emit('rooms', app.getRoomsForEnter());
    });

    socket.on('room-create', (title: string, user: IGameUser) => {
      if (app.isRoomExist(title) || !title) {
        socket.emit('room-error', createErrorMessage(title, true));
        return;
      }
      const room = app.addRoom(title, user);
      socket.join(title);
      socket.emit('room-joined', title);
      io.emit('new-room', room);
    });

    socket.on('room-leave', (title, id) => {
      const room = app.leaveFromRoom(title, id);
      if (!room) return;
      if (room.users.length) {
        io.emit('room-update', room);
        return;
      }
      io.emit('room-delete', room);
      app.rooms.deleteRoom(title);
    });

    socket.on('join-room', (title: string) => {
      socket.join(title);
      const username = socket.handshake.query.username;
      const name = Array.isArray(username) ? username.join('') : username;
      const room = app.joinUserToRoom(title, {
        id: socket.id,
        name: name ?? 'user',
        isUserReady: false,
      });
      socket.emit('joined-room', room);
      io.emit('room-update', room);
    });
  });
};
