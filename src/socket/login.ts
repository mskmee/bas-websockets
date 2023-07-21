import { Server } from 'socket.io';
import { app } from '../app';
import { createErrorMessage } from '../helpers/createErrorMessage';

export default (io: Server) => {
  io.on('connect', (socket) => {
    const username = socket.handshake.query.username;
    if (!username) {
      return;
    }
    const name = Array.isArray(username) ? username.join('') : username;
    const isUserAdd = app.addUser(name, socket.id);
    if (!isUserAdd) {
      console.log(name);
      socket.emit('name-error', createErrorMessage(name));
      return;
    }
    socket.emit('rooms', app.getRoomsForEnter());
    console.log(app.users.users);
    socket.on('disconnect', () => {
      app.removeUser(name);
    });
  });
};
