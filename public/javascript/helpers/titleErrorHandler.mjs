import { showMessageModal } from '../views/modal.mjs';

export const titleErrorHandler = (message, isRoom = false) => {
  const onClose = isRoom
    ? undefined
    : () => {
        sessionStorage.setItem('username', '');
        window.location.replace('/login');
      };
  console.log(onClose);
  showMessageModal({
    message,
    onClose,
  });
};
