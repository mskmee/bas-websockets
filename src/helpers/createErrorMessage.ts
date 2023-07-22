export const createErrorMessage = (name: string, isRoom = false) => {
  return `${isRoom ? 'Room' : 'User'} ${name} already exists`;
};
