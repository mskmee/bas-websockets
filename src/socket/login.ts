import { Server } from 'socket.io';
import { app } from '../app';
import { createErrorMessage } from '../helpers/createErrorMessage';
import { updateDeleteRoom } from '../helpers/updateDeleteRoomEvent';
import { startGame } from '../helpers/startGame';

export default (io: Server) => {
  io.on('connect', (socket) => {
    const username = socket.handshake.query.username;
    if (!username) {
      return;
    }
    const name = Array.isArray(username) ? username.join('') : username;
    const isUserAdd = app.addUser(name, socket.id);
    if (!isUserAdd) {
      socket.emit('name-error', createErrorMessage(name));
      return;
    }
    socket.emit('rooms', app.getRoomsForEnter());

    socket.on('disconnect', () => {
      const room = app.disconnectUser(name);
      if (!room) return;
      const isRoomDelete = updateDeleteRoom(io, room);
      isRoomDelete && app.rooms.deleteRoom(room.title);
      if (!isRoomDelete) {
        const isPlayersReady = room.users.every((user) => user.isUserReady);
        isPlayersReady &&
          !room.isGameStart &&
          room.users.length > 1 &&
          startGame(app, io, room);
        const isUsersDoneTask = room.users.every(
          (user) => user.progress === 100
        );
        if (isUsersDoneTask) {
          io.to(room.title).emit('game-end', app.getGameResult(room.title));
          io.emit('room-game-end', app.resetRoomGameStats(room.title));
        }
      }
      io.to(room.title).emit('room-leave', name);
      socket.leave(room.title);
    });
  });
};
