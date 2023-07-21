import { lobbyController } from './controllers/lobbyController.mjs';
import { titleErrorHandler } from './helpers/titleErrorHandler.mjs';

const username = sessionStorage.getItem('username');

if (!username) {
  window.location.replace('/login');
}

const socket = io('', { query: { username } });
lobbyController.init();

socket.on('name-error', (message) => {
  titleErrorHandler(message);
});

socket.on('rooms', (data) => {
  lobbyController.renderRooms(data);
});
