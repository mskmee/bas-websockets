import { Server } from 'socket.io';
import { app } from '../app';
import { getGameTimer } from '../helpers/getGameCounter';
import { SECONDS_FOR_GAME, SECONDS_TIMER_BEFORE_START_GAME } from './config';
import { getRandomText } from '../helpers/getRandomText';

export default (io: Server) => {
  io.on('connect', (socket) => {
    socket.on('change-user-status', async (title: string, user: string) => {
      const updateStatus = app.changeUserReadyStatus(title, user);
      io.to(title).emit('update-user-status', updateStatus);
      const room = app.getRoomByTitle(title);
      if (!room) return;
      const isPlayersReady = room.users.every((user) => user.isUserReady);
      if (isPlayersReady && room.users.length > 1) {
        await getGameTimer(
          io,
          room.title,
          'game-counter-start',
          SECONDS_TIMER_BEFORE_START_GAME
        );
        io.to(room.title).emit('game-start', getRandomText());
        await getGameTimer(io, room.title, 'game-counter', SECONDS_FOR_GAME);
      }
    });
  });
};
