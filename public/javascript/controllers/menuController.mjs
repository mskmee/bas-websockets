import { titleErrorHandler } from '../helpers/titleErrorHandler.mjs';
import { showInputModal } from '../views/modal.mjs';
import {
  appendRoomElement,
  removeRoomElement,
  updateNumberOfUsersInRoom,
} from '../views/room.mjs';

export class MenuController {
  constructor(socket) {
    this.createRoomBtn = document.getElementById('add-room-btn');
    this.lobbyBlock = document.getElementById('rooms-page');
    this.gameBlock = document.getElementById('game-page');
    this.leaveLobbyBtn = document.getElementById('quit-room-btn');
    this.socket = socket;
    this.userName = sessionStorage.getItem('username');
    this.roomTitle = '';
  }

  createRoom = () => {
    let roomName = '';
    showInputModal({
      title: 'Enter room name:',
      onChange: (value) => {
        roomName = value;
      },
      onSubmit: () => {
        this.socket.emit('room-create', roomName, {
          id: this.socket.id,
          name: this.userName,
          isUserReady: false,
        });
      },
    });
  };

  joinRoom = (title) => {
    this.socket.emit('join-room', title);
  };

  renderRooms = (data) => {
    data.forEach((element) => {
      const { title: name, users, maxUsers } = element;
      const numberOfUsers = `${users.length}/${maxUsers}`;
      appendRoomElement({
        name,
        numberOfUsers,
        onJoin: this.joinRoom.bind(this, name),
      });
    });
  };

  toggleJoinLobby = (roomTitle) => {
    this.lobbyBlock.classList.toggle('display-none');
    this.gameBlock.classList.toggle('display-none');
    this.roomTitle = roomTitle;
  };

  leaveRoom = () => {
    this.socket.emit('room-leave', this.roomTitle, this.userName);
    this.toggleJoinLobby('');
  };

  socketEvents = () => {
    this.socket.on('rooms', (data) => this.renderRooms(data));
    this.socket.on('new-room', (newRoom) => this.renderRooms([newRoom]));
    this.socket.on('room-error', (data) => titleErrorHandler(data, true));
    this.socket.on('room-update', (roomData) => {
      if (!roomData) return;
      const { title: name, users, maxUsers } = roomData;
      if (users.length === maxUsers) {
        removeRoomElement(name);
        return;
      }
      const numberOfUsers = `${users.length}/${maxUsers}`;
      updateNumberOfUsersInRoom({
        name,
        numberOfUsers,
      });
    });
    this.socket.on('joined-room', (room) =>
      this.toggleJoinLobby(room.title || '')
    );
    this.socket.on('room-delete', (room) => removeRoomElement(room.title));
  };

  init = () => {
    this.socketEvents();
    this.createRoomBtn.addEventListener('click', this.createRoom);
    document.addEventListener('beforeunload', () => socket.disconnect());
    this.leaveLobbyBtn.addEventListener('click', this.leaveRoom);
  };
}
