import React from 'react';
import { storiesOf } from '@storybook/react';
import { PromiseModal, usePromiseModal } from '../PromiseModal';


const Modal = ({ open, children }) => {
  if (!open) {
    return null;
  }
  return (
    <div>{children}</div>
  );
};

const Content = ({ clickButton1, clickButton2 }) => (
  <React.Fragment>
    <button onClick={clickButton1}>click 1</button>
    <button onClick={clickButton2}>click 2</button>
  </React.Fragment>
);

const Stuff = () => {
  const [message, setMessage] = React.useState('');
  
  const { launchPromiseModal } = usePromiseModal(Content);

  const handleClick = async () => {
    const result = await launchPromiseModal({ actionProps: ['clickButton1', 'clickButton2'] });
    setMessage(`You clicked ${result}`);
  };

  return (
    <div>
      <button onClick={handleClick}>Open</button>
      {message}
    </div>
  );
};

storiesOf('PromiseModal', module)
  .addWithJSX('with default modal', () => (
    <PromiseModal
      Modal={Modal}
    >
      <Stuff />
    </PromiseModal>
  ));
