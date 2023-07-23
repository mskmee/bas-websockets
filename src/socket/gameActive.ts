import { Server } from 'socket.io';
import { app } from '../app';
import { IUpdateUserGameStatus } from '../types/interfaces/IUpdateUserGameStatus';
import { startGame } from '../helpers/startGame';

export default (io: Server) => {
  io.on('connect', (socket) => {
    socket.on('change-user-status', async (title: string, user: string) => {
      const updateStatus = app.changeUserReadyStatus(title, user);
      io.to(title).emit('update-user-status', updateStatus);
      const room = app.getRoomByTitle(title);
      if (!room) return;
      const isPlayersReady = room.users.every((user) => user.isUserReady);
      if (isPlayersReady && room.users.length > 1) {
        startGame(app, io, room);
      }
    });
    socket.on('game-update', (data: IUpdateUserGameStatus) => {
      const room = app.updateGameStatus(data);
      if (!room) return;
      io.to(data.room).emit('game-update', room.users);
      const isPlayersFinished = room.users.every(
        (user) => user.progress === 100
      );
      if (!isPlayersFinished) return;
      io.to(data.room).emit('game-end', app.getGameResult(room.title));
      io.except(data.room).emit(
        'room-game-end',
        app.resetRoomGameStats(room.title)
      );
    });
  });
};
