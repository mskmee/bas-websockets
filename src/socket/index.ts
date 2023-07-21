import { Server } from 'socket.io';
import login from './login';
import gameRooms from './gameRooms';
import gameActive from './gameActive';

export default (io: Server) => {
  login(io), gameRooms(io), gameActive(io);
};
