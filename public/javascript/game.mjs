import { MainController } from './controllers/mainController.mjs';
import { titleErrorHandler } from './helpers/titleErrorHandler.mjs';

const username = sessionStorage.getItem('username');

if (!username) {
  window.location.replace('/login');
}

const socket = io('', { query: { username } });
const controller = new MainController(socket);
controller.init();

socket.on('name-error', (message) => {
  titleErrorHandler(message);
});
