import data from '../data';

export const getRandomTextIndex = () => {
  return Math.floor(Math.random() * data.texts.length);
};
