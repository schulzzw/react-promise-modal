import React from 'react';
import { ModalContext } from './provider/ModalProvider';

const checkForDupKeys = (a, b) => {
  const dups = a
    .filter(ak => b.includes(ak));
  if (dups.length) {
    console.warn(`modalProp key(s) [${dups.join(', ')}] are being overridden by actionProps. If you would like to use the ones from modalProps please remove them from actionProps.`);
  }
};

const usePromiseModal = (initialModalChildren = null) => {
  const { setModalContent, setIsOpen, setModalProps } = React.useContext(ModalContext);

  React.useEffect(() => {
    setModalContent(initialModalChildren);
  }, [initialModalChildren]);

  const launchPromiseModal = ({
    modalProps = {},
    actionProps = [],
  } = {}) => {
    checkForDupKeys(Object.keys(modalProps), actionProps);

    const actionHandler = (cb, name) => () => {
      console.log('clicked');
      setIsOpen(false);
      cb(name);
    };

    const promise = new Promise((resolve) => {
      setModalProps({
        ...modalProps,
        ...actionProps.reduce((acc, action) => ({
          ...acc,
          [action]: actionHandler(resolve, action),
        }), {}),
      });
    });
    setIsOpen(true);

    return promise;
  };

  return { launchPromiseModal };
};

export default usePromiseModal;
