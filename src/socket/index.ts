import { Server } from 'socket.io';
import login from './login';
import gameRooms from './gameRooms';

export default (io: Server) => {
  login(io), gameRooms(io);
};
