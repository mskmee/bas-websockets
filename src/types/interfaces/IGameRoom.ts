import { IGameUser } from './IGameUser';

export interface IGameRoom {
  isGameStart: boolean;
  title: string;
  users: IGameUser[];
  maxUsers: number;
  gameResult: string[];
}
