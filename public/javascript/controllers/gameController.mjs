import { getPercentFromNumbers } from '../helpers/getPercentFromNumbers.mjs';
import { showResultsModal } from '../views/modal.mjs';
import { changeReadyStatus, setProgress } from '../views/user.mjs';

export class GameController {
  constructor(socket) {
    this.readyBtn = document.getElementById('ready-btn');
    this.timer = document.getElementById('timer');
    this.textContainer = document.getElementById('text-container');
    this.gameTimerContainer = document.getElementById('game-timer');
    this.gameTimerSeconds = document.getElementById('game-timer-seconds');
    this.exitLobbyBtn = document.getElementById('quit-room-btn');
    this.socket = socket;
    this.gameIndex = 0;
    this.gameLength = 0;
    this.userName = sessionStorage.getItem('username');
    this.roomTitle = '';
  }

  preGameCounterStart = (time) => {
    this.exitLobbyBtn.classList.add('display-none');
    this.readyBtn.classList.add('display-none');
    this.timer.classList.remove('display-none');
    this.timer.textContent = time;
  };

  gameCounterStart = (time) => {
    this.gameTimerSeconds.textContent = time;
  };

  emitGameUpdate = (completedPercent) => {
    this.socket.emit('game-update', {
      username: this.userName,
      room: this.roomTitle,
      completedPercent,
    });
  };

  gameListener = (e) => {
    const pressedChar = e.key;
    const activeChar = this.textContainer.querySelector('.active-char');
    if (activeChar && pressedChar === activeChar.textContent) {
      const allChars = this.textContainer.querySelectorAll('.game-char');
      this.gameIndex++;
      activeChar.classList.add('completed-char');
      activeChar.classList.remove('active-char');
      const completedPercent = getPercentFromNumbers(
        this.gameIndex,
        this.gameLength
      );
      this.emitGameUpdate(completedPercent);
      if (allChars.length > this.gameIndex) {
        allChars[this.gameIndex].classList.add('active-char');
      }
    }
  };

  getGameText = async (id) => {
    const response = await fetch(`http://localhost:3002/game/texts/${id}`);
    const data = await response.json();
    this.textContainer.innerHTML = '';
    const dataArr = data.text.split('');
    this.gameLength = dataArr.length;
    dataArr.forEach((char, index) => {
      this.textContainer.insertAdjacentHTML(
        'beforeend',
        `<span class='game-char${
          (!index && ' active-char') || ''
        }'>${char}</span>`
      );
    });
  };

  gameStart = () => {
    this.readyBtn.classList.add('display-none');
    this.timer.classList.add('display-none');
    this.textContainer.classList.remove('display-none');
    this.gameTimerContainer.classList.remove('display-none');
    this.roomTitle = document.getElementById('room-name').textContent;
    document.addEventListener('keydown', this.gameListener);
  };

  showResult = (result) => {
    return new Promise((resolve) => {
      showResultsModal({
        usersSortedArray: result,
        onClose: () => {
          resolve();
        },
      });
    });
  };

  gameEnds = async (result) => {
    document.removeEventListener('keydown', this.gameListener);
    this.gameTimerContainer.classList.add('display-none');
    this.gameIndex = 0;
    this.textContainer.classList.add('display-none');
    result.forEach((username) => {
      setProgress({ username, progress: 0 });
      changeReadyStatus({ username, ready: false });
    });
    await this.showResult(result);
    this.emitGameUpdate(0);
    this.exitLobbyBtn.classList.remove('display-none');
    this.readyBtn.classList.remove('display-none');
    this.readyBtn.textContent = 'READY';
  };

  updateGame = (users) => {
    users.forEach((user) =>
      setProgress({ username: user.name, progress: user.progress })
    );
  };

  socketEvents = () => {
    this.socket.on('game-counter-start', (time) =>
      this.preGameCounterStart(time)
    );
    this.socket.on('game-counter', (time) => this.gameCounterStart(time));
    this.socket.on('game-text-index', (index) => this.getGameText(index));
    this.socket.on('game-start', () => this.gameStart());
    this.socket.on('game-update', (users) => this.updateGame(users));
    this.socket.on('game-end', (result) => this.gameEnds(result));
  };

  init = () => {
    this.socketEvents();
    document.addEventListener('beforeunload', () => {
      document.removeEventListener('keydown', this.gameListener);
      this.socket.emit('disconnect');
    });
  };
}
