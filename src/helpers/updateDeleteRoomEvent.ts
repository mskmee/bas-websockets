import { Server } from 'socket.io';
import { IGameRoom } from '../types/interfaces/IGameRoom';

export const updateDeleteRoom = (io: Server, room: IGameRoom) => {
  const { users, maxUsers } = room;
  if (users.length) {
    if (users.length === maxUsers - 1) {
      io.emit('new-room', room);
    }
    io.emit('room-update', room);
    return false;
  }
  io.emit('room-delete', room);
  return true;
};
