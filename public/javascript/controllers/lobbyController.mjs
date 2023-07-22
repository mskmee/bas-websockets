import {
  appendUserElement,
  removeUserElement,
  changeReadyStatus,
} from '../views/user.mjs';

export class LobbyController {
  constructor(socket) {
    this.socket = socket;
    this.usersWrapper = document.getElementById('users-wrapper');
    this.readyBtn = document.getElementById('ready-btn');
    this.roomTitle = document.getElementById('room-name');
    this.userName = sessionStorage.getItem('username');
    this.roomName = '';
  }

  setUserReady = () => {
    this.socket.emit('change-user-status', this.roomName, this.userName);
  };

  renderUser = (user) => {
    appendUserElement({
      username: user.name,
      ready: user.isUserReady,
      isCurrentUser: user.name === this.userName,
    });
  };

  renderRoomUsers = (room) => {
    this.roomName = room.title;
    this.roomTitle.textContent = room.title;
    room.users.forEach((user) => this.renderUser(user));
  };

  leaveRoom = (userName) => {
    removeUserElement(userName);
    if (userName === this.userName) {
      this.usersWrapper.innerHTML = '';
      this.roomName = '';
    }
  };

  socketEvents = () => {
    this.socket.on('new-user', (user) => this.renderUser(user));
    this.socket.on('joined-room', (room) => this.renderRoomUsers(room));
    this.socket.on('room-leave', (userName) => this.leaveRoom(userName));
    this.socket.on('update-user-status', (user) => changeReadyStatus(user));
  };
  init = () => {
    this.socketEvents();
    this.readyBtn.addEventListener('click', this.setUserReady);
  };
}
