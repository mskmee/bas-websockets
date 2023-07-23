import { Server } from 'socket.io';
import { clearInterval } from 'timers';

export const getGameTimer = (
  io: Server,
  title: string,
  event: string,
  timer: number
) => {
  const msInSecond = 1000;
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (timer > 1) {
        timer--;
        io.to(title).emit(event, timer);
      } else {
        clearInterval(interval);
        resolve();
      }
    }, msInSecond);
  });
};
