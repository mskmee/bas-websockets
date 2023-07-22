import data from '../data';

export const getRandomText = () => {
  const randomNum = Math.floor(Math.random() * data.texts.length);
  return data.texts[randomNum];
};
