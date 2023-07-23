import { IGameRoom } from '../types/interfaces/IGameRoom';

export const resetRoomGame = (room: IGameRoom) => {
  const updateUsers = room.users.map((user) => {
    user.isUserReady = false;
    user.progress = 0;
    return user;
  });

  return {
    ...room,
    isGameStart: false,
    gameResult: [],
    users: updateUsers,
  };
};
