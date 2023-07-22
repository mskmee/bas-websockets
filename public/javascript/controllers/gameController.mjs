export class GameController {
  constructor(socket) {
    this.readyBtn = document.getElementById('ready-btn');
    this.timer = document.getElementById('timer');
    this.textContainer = document.getElementById('text-container');
    this.gameTimerContainer = document.getElementById('game-timer');
    this.gameTimerSeconds = document.getElementById('game-timer-seconds');
    this.exitLobbyBtn = document.getElementById('quit-room-btn');
    this.socket = socket;
  }

  preGameCounterStart = (time) => {
    this.exitLobbyBtn.classList.add('display-none');
    this.readyBtn.classList.add('display-none');
    this.timer.classList.remove('display-none');
    this.timer.textContent = time;
  };

  gameCounterStart = (time) => {
    this.gameTimerContainer.classList.remove('display-none');
    this.gameTimerSeconds.textContent = time;
  };

  gameListener = (e) => {
    console.log(e);
  };

  gameStart = (text) => {
    this.timer.classList.add('display-none');
    this.textContainer.textContent = text;
    this.textContainer.classList.remove('display-none');
    document.addEventListener('keydown', this.gameListener);
  };

  socketEvents = () => {
    this.socket.on('game-counter-start', (time) =>
      this.preGameCounterStart(time)
    );
    this.socket.on('game-counter', (time) => this.gameCounterStart(time));
    this.socket.on('game-start', (text) => this.gameStart(text));
  };

  init = () => {
    this.socketEvents();
  };
}
