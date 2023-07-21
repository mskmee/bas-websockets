import { MAXIMUM_USERS_FOR_ONE_ROOM } from '../socket/config';
import { IGameRoom } from '../types/interfaces/IGameRoom';
import { IGameUser } from '../types/interfaces/IGameUser';

export class GameRooms {
  rooms: Map<string, IGameRoom>;

  constructor() {
    this.rooms = new Map();
    this.rooms.set('room1', {
      isGameStart: false,
      id: 'room1',
      title: 'Room 1',
      users: [],
      maxUsers: MAXIMUM_USERS_FOR_ONE_ROOM,
    });
    console.log(this.rooms);
  }

  createRoom(title: string, id: string) {
    const newRoom: IGameRoom = {
      id,
      isGameStart: false,
      title,
      users: [],
      maxUsers: MAXIMUM_USERS_FOR_ONE_ROOM,
    };
    this.rooms.set(title, newRoom);
  }

  removeRoom(title: string) {
    this.rooms.delete(title);
  }

  getRoom(title: string) {
    return this.rooms.get(title);
  }

  getRooms() {
    return this.rooms;
  }

  addUser(title: string, user: IGameUser) {
    const room = this.rooms.get(title);
    if (room && room.users.length < MAXIMUM_USERS_FOR_ONE_ROOM) {
      room.users.push(user);
      return true;
    }
    return false;
  }
}
