import React from 'react';
import PropTypes from 'prop-types';
import elementPropType from '../../../utils/elementTypePropTypeChecker';

const ModalContext = React.createContext();

const ModalProvider = ({ children, Modal }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [ModalContent, setModalChild] = React.useState(null);
  const [modalProps, setModalProps] = React.useState({});

  const setModalContent = Content => setModalChild(() => Content);
  return (
    <ModalContext.Provider
      value={{ setIsOpen, setModalContent, setModalProps }}
    >
      {children}
      <Modal open={isOpen} >
        { ModalContent ? <ModalContent {...modalProps} /> : null }
      </Modal>
    </ModalContext.Provider>
  );
};

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
  Modal: elementPropType.isRequired,
};

export default ModalProvider;

export { ModalContext, ModalProvider };
