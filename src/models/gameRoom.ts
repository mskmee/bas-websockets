import { MAXIMUM_USERS_FOR_ONE_ROOM } from '../socket/config';
import { IGameRoom } from '../types/interfaces/IGameRoom';
import { IGameUser } from '../types/interfaces/IGameUser';
import { IUpdateUserReadyStatus } from '../types/interfaces/IUpdateUserReadyStatus';

export class GameRooms {
  rooms: Map<string, IGameRoom>;

  constructor() {
    this.rooms = new Map();
  }

  createRoom(title: string, user: IGameUser) {
    const newRoom: IGameRoom = {
      isGameStart: false,
      title,
      users: [user],
      maxUsers: MAXIMUM_USERS_FOR_ONE_ROOM,
    };
    this.rooms.set(title, newRoom);
    return newRoom;
  }

  deleteRoom(title: string) {
    this.rooms.delete(title);
  }

  getRoom = (title: string) => {
    return this.rooms.get(title);
  };

  getRooms() {
    return this.rooms;
  }

  addUser(title: string, user: IGameUser) {
    const room = this.rooms.get(title);
    if (room && room.users.length < MAXIMUM_USERS_FOR_ONE_ROOM) {
      room.users.push(user);
    }
    return this.rooms.get(title);
  }

  leaveRoom = (title: string, userName: string) => {
    const room = this.getRoom(title);
    if (!room) return;
    const updateUsers = room.users.filter((user) => user.name !== userName);
    this.rooms.set(title, { ...room, users: updateUsers });
    return this.getRoom(title);
  };

  findAndDeleteUser = (name: string) => {
    for (const room of this.rooms.values()) {
      const userIndex = room.users.findIndex((user) => user.name === name);
      if (userIndex !== -1) {
        room.users.splice(userIndex, 1);
        return room;
      }
    }
  };

  changeUserStatus = (title: string, userName: string) => {
    const room = this.getRoom(title);
    if (!room) return null;
    const userToUpdate = room.users.find((user) => user.name === userName);
    if (!userToUpdate) return null;
    userToUpdate.isUserReady = !userToUpdate.isUserReady;

    this.rooms.set(title, { ...room, users: [...room.users] });
    const userStatus: IUpdateUserReadyStatus = {
      ready: userToUpdate.isUserReady,
      username: userName,
    };
    return userStatus;
  };
}
