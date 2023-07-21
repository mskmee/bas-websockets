import { GameRooms } from './models/gameRoom';
import { GameUsers } from './models/gameUsers';
import { IGameUser } from './types/interfaces/IGameUser';

class App {
  users: GameUsers;

  rooms: GameRooms;

  constructor() {
    this.users = new GameUsers();
    this.rooms = new GameRooms();
  }

  addUser = (name: string, id: string) => {
    if (this.users.isUserExist(name, id)) {
      return false;
    }
    this.users.addUser(name, id);
    return true;
  };

  disconnectUser = (name: string) => {
    this.users.removeUser = name;
    return this.rooms.findAndDeleteUser(name);
  };

  getRoomsForEnter = () => {
    return Array.from(this.rooms.getRooms().values()).filter(
      (room) => !room.isGameStart && room.users.length < room.maxUsers
    );
  };

  addUserToRoom = (user: IGameUser, roomId: string) => {
    this.rooms.addUser(roomId, user);
  };

  addRoom = (title: string, user: IGameUser) => {
    return this.rooms.createRoom(title, user);
  };

  leaveFromRoom = (title: string, userName: string) => {
    return this.rooms.leaveRoom(title, userName);
  };

  isRoomExist = (title: string) => {
    return this.rooms.getRoom(title);
  };

  getRoomByTitle = (title: string) => {
    return this.rooms.getRoom(title);
  };

  joinUserToRoom = (title: string, user: IGameUser) => {
    return this.rooms.addUser(title, user);
  };
  changeUserReadyStatus = (title: string, userName: string) => {
    return this.rooms.changeUserStatus(title, userName);
  };
}

export const app = new App();
