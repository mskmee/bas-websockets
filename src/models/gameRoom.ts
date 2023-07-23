import { IGameRoom } from '../types/interfaces/IGameRoom';

export class GameRooms {
  rooms: Map<string, IGameRoom>;

  constructor() {
    this.rooms = new Map();
  }

  setRoom = (title: string, room: IGameRoom) => {
    return this.rooms.set(title, room);
  };

  deleteRoom(title: string) {
    return this.rooms.delete(title);
  }

  getRoom = (title: string) => {
    return this.rooms.get(title);
  };

  getRooms() {
    return this.rooms;
  }

  findAndDeleteUser = (name: string) => {
    for (const room of this.rooms.values()) {
      const userIndex = room.users.findIndex((user) => user.name === name);
      if (userIndex !== -1) {
        room.users.splice(userIndex, 1);
        return room;
      }
    }
  };
}
