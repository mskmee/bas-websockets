import { IGameUser } from './IGameUser';

export interface IGameRoom {
  isGameStart: boolean;
  id: string;
  title: string;
  users: IGameUser[];
  maxUsers: number;
}
