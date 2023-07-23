import { Server } from 'socket.io';
import { App } from '../app';
import { getGameTimer } from './getGameCounter';
import { getRandomTextIndex } from './getRandomText';
import {
  SECONDS_FOR_GAME,
  SECONDS_TIMER_BEFORE_START_GAME,
} from '../socket/config';
import { IGameRoom } from '../types/interfaces/IGameRoom';

export const startGame = async (app: App, io: Server, room: IGameRoom) => {
  const { title } = room;
  app.changeRoomStatus(title, true);
  io.emit('room-update', { ...room, isGameStart: true });
  io.to(title).emit('game-text-index', getRandomTextIndex());
  await getGameTimer(
    io,
    title,
    'game-counter-start',
    SECONDS_TIMER_BEFORE_START_GAME
  );
  io.to(title).emit('game-start', getRandomTextIndex());
  await getGameTimer(io, title, 'game-counter', SECONDS_FOR_GAME);
  const updateRoom = app.getRoomByTitle(title);
  if (!updateRoom || !updateRoom.isGameStart) return;
  io.to(title).emit('game-end', app.getGameResult(title));
  io.emit('room-game-end', app.resetRoomGameStats(title));
};
