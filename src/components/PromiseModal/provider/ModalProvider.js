import React from 'react';
import PropTypes from 'prop-types';
import elementPropType from '../../../utils/elementTypePropTypeChecker';

const ModalContext = React.createContext();

const ModalProvider = ({ children, Modal }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [modalChildren, setModalChildren] = React.useState(null);
  const [modalProps, setModalProps] = React.useState({});
  return (
    <ModalContext.Provider
      value={{ setIsOpen, setModalChildren, setModalProps }}
    >
      {children}
      <Modal open={isOpen} {...modalProps} >{modalChildren}</Modal>
    </ModalContext.Provider>
  );
};

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
  Modal: elementPropType.isRequired,
};

export default ModalProvider;

export { ModalContext, ModalProvider };
