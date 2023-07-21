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

  removeUser = (name: string) => {
    this.users.removeUser = name;
  };

  getRoomsForEnter = () => {
    return Array.from(this.rooms.getRooms().values()).filter(
      (room) => !room.isGameStart && room.users.length < room.maxUsers
    );
  };

  addUserToRoom = (user: IGameUser, roomId: string) => {
    this.rooms.addUser(roomId, user);
  };

  addRoom = (roomId: string, title: string) => {
    if (this.rooms.getRoom(title)) {
      return false;
    }
    this.rooms.createRoom(title, roomId);
    return true;
  };

  getRoomByTitle = (title: string) => {
    return this.rooms.getRoom(title);
  };
}

export const app = new App();
