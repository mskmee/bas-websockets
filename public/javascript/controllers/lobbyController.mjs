import { titleErrorHandler } from '../helpers/titleErrorHandler.mjs';
import { showInputModal } from '../views/modal.mjs';
import { appendRoomElement } from '../views/room.mjs';

class LobbyController {
  constructor() {
    this.createRoomBtn = document.getElementById('add-room-btn');
    this.socket = io('');
    this.userName = sessionStorage.getItem('username');
  }

  createRoom = () => {
    let roomName = '';
    showInputModal({
      title: 'Enter room name:',
      onChange: (value) => {
        roomName = value;
      },
      onSubmit: () => {
        this.socket.emit('create-room', roomName);
      },
    });
  };

  joinRoom() {
    this.socket.emit('join-room', this.socket.id);
  }

  renderRooms = (data) => {
    data.forEach((element) => {
      const { title: name, users, maxUsers } = element;
      const numberOfUsers = `${users.length}/${maxUsers}`;
      appendRoomElement({ name, numberOfUsers });
    });
  };

  socketEvents = () => {
    this.socket.on('rooms', (roomsData) => {
      this.renderRooms(roomsData);
    });
    this.socket.on('new-room', (newRoom) => {
      this.renderRooms([newRoom]);
    });
    this.socket.on('room-error', (data) => {
      titleErrorHandler(data, true);
    });
    this.socket.on('room-joined', (data) => {
      this.renderRooms(data);
    });
  };

  init = () => {
    this.socketEvents();
    this.createRoomBtn.addEventListener('click', this.createRoom);
    document.addEventListener('beforeunload', () => {
      socket.disconnect();
    });
  };
}

export const lobbyController = new LobbyController();
