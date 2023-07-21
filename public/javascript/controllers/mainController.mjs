import { LobbyController } from './lobbyController.mjs';

export class MainController {
  constructor(socket) {
    this.lobbyController = new LobbyController(socket);
    this.lobbyController.init();
  }
}
