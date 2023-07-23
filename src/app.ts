import { GameRooms } from './models/gameRoom';
import { GameUsers } from './models/gameUsers';
import { IGameUser } from './types/interfaces/IGameUser';
import { IUpdateUserGameStatus } from './types/interfaces/IUpdateUserGameStatus';
import { IGameRoom } from './types/interfaces/IGameRoom';
import { MAXIMUM_USERS_FOR_ONE_ROOM } from './socket/config';
import { IUpdateUserReadyStatus } from './types/interfaces/IUpdateUserReadyStatus';
import { resetRoomGame } from './helpers/resetRoomGame';

export class App {
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

  addRoom = (title: string, user: IGameUser) => {
    const newRoom: IGameRoom = {
      isGameStart: false,
      title,
      users: [user],
      maxUsers: MAXIMUM_USERS_FOR_ONE_ROOM,
      gameResult: [],
    };
    this.rooms.setRoom(title, newRoom);
    return this.rooms.getRoom(title);
  };

  leaveFromRoom = (title: string, userName: string) => {
    const room = this.rooms.getRoom(title);
    if (!room) return;
    const updateUsers = room.users.filter((user) => user.name !== userName);
    this.rooms.setRoom(title, { ...room, users: updateUsers });
    return this.rooms.getRoom(title);
  };

  getRoomByTitle = (title: string) => {
    return this.rooms.getRoom(title);
  };

  joinUserToRoom = (title: string, user: IGameUser) => {
    const room = this.rooms.getRoom(title);
    if (room && room.users.length < MAXIMUM_USERS_FOR_ONE_ROOM) {
      room.users.push(user);
      this.rooms.setRoom(title, room);
      return this.rooms.getRoom(title);
    }
  };

  changeUserReadyStatus = (title: string, userName: string) => {
    const room = this.rooms.getRoom(title);
    if (!room) return null;
    const userToUpdate = room.users.find((user) => user.name === userName);
    if (!userToUpdate) return null;
    userToUpdate.isUserReady = !userToUpdate.isUserReady;
    this.rooms.setRoom(title, { ...room, users: [...room.users] });
    const userStatus: IUpdateUserReadyStatus = {
      ready: userToUpdate.isUserReady,
      username: userName,
    };
    return userStatus;
  };

  changeRoomStatus = (title: string, status: boolean) => {
    const room = this.rooms.getRoom(title);
    if (!room) return null;
    const updateRoom = { ...room, isGameStart: status };
    this.rooms.setRoom(title, updateRoom);
  };

  updateGameStatus = (data: IUpdateUserGameStatus) => {
    const { username, room: title, completedPercent } = data;
    const room = this.rooms.getRoom(title);
    if (!room) return null;
    room.users = room.users.map((user) =>
      username === user.name ? { ...user, progress: completedPercent } : user
    );
    if (completedPercent === 100) {
      room.gameResult.push(username);
    }
    this.rooms.setRoom(title, room);
    return this.rooms.getRoom(title);
  };

  getGameResult = (title: string) => {
    const room = this.rooms.getRoom(title);
    if (!room) return null;
    const results = room.gameResult.filter((userName) =>
      room.users.some((user) => user.name === userName)
    );

    if (room.users.length === results.length) {
      return results;
    }
    const notFinishedPlayers = [
      ...room.users
        .sort((a, b) => b.progress - a.progress)
        .slice(results.length),
    ];
    return results.concat(notFinishedPlayers.map((user) => user.name));
  };

  resetRoomGameStats = (title: string) => {
    const room = this.rooms.getRoom(title);
    if (!room) return;
    const resetRoom = resetRoomGame(room);
    this.rooms.setRoom(title, resetRoom);
    return resetRoom;
  };
}

export const app = new App();
