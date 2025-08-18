import { useState } from 'react';

export const useAlert = () => {
  const [alert, setAlert] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: []
  });

  const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
    setAlert({
      visible: true,
      title,
      message,
      buttons
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, visible: false }));
  };

  return { alert, showAlert, hideAlert };
};