import { Server } from 'socket.io';
import { IGameRoom } from '../types/interfaces/IGameRoom';

export const updateDeleteRoom = (io: Server, room: IGameRoom) => {
  if (room.users.length) {
    io.emit('room-update', room);
    return false;
  }
  io.emit('room-delete', room);
  return true;
};
