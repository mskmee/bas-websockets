import { GameController } from './gameController.mjs';
import { LobbyController } from './lobbyController.mjs';
import { MenuController } from './menuController.mjs';

export class MainController {
  constructor(socket) {
    this.menuController = new MenuController(socket);
    this.lobbyController = new LobbyController(socket);
    this.gameController = new GameController(socket);
  }
  init() {
    this.menuController.init();
    this.lobbyController.init();
    this.gameController.init();
  }
}
