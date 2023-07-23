import { Server } from 'socket.io';
import { app } from '../app';
import { createErrorMessage } from '../helpers/createErrorMessage';
import { IGameUser } from '../types/interfaces/IGameUser';
import { updateDeleteRoom } from '../helpers/updateDeleteRoomEvent';
import { startGame } from '../helpers/startGame';

export default (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('get-rooms', () => {
      socket.emit('rooms', app.getRoomsForEnter());
    });

    socket.on('room-create', (title: string, user: IGameUser) => {
      if (app.getRoomByTitle(title) || !title) {
        socket.emit('room-error', createErrorMessage(title, true));
        return;
      }
      const room = app.addRoom(title, user);
      socket.join(title);
      socket.emit('joined-room', room);
      io.emit('new-room', room);
    });

    socket.on('room-leave', (title, userName) => {
      const room = app.leaveFromRoom(title, userName);
      if (!room) return;
      io.to(title).emit('room-leave', userName);
      socket.leave(title);
      const isRoomDelete = updateDeleteRoom(io, room);
      isRoomDelete && app.rooms.deleteRoom(title);
      const isPlayersReady = room.users.every((user) => user.isUserReady);
      !isRoomDelete &&
        isPlayersReady &&
        room.users.length > 1 &&
        startGame(app, io, room);
    });

    socket.on('join-room', (title: string) => {
      socket.join(title);
      const username = socket.handshake.query.username;
      const name = Array.isArray(username) ? username.join('') : username;
      const user: IGameUser = {
        id: socket.id,
        name: name ?? 'user',
        isUserReady: false,
        progress: 0,
      };
      const room = app.joinUserToRoom(title, user);
      socket.emit('joined-room', room);
      io.to(title).except(socket.id).emit('new-user', user);
      io.emit('room-update', room);
    });
  });
};
