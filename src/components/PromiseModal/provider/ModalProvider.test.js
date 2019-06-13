import React from 'react';
import { cleanup, fireEvent, waitForElement } from '@testing-library/react';
import renderComponent from '../../../testUtils/renderComponent';
import { ModalProvider, ModalContext } from './ModalProvider';

/* eslint-disable */
const Modal = ({ open, children }) => (
  <React.Fragment>
    <div>the modal</div>
    {open ? <div>open</div> : null}
    {children === null ? <div>null children</div> : children}
  </React.Fragment>
);
const ModalContent = (props) => (
  <React.Fragment>
    <div>modal children</div>
    <div>additional prop length {Object.keys(props).length}</div>
  </React.Fragment>
);

const children = (
  <ModalContext.Consumer>
    { value => (
      <React.Fragment>
        <div>the children</div>
        <div onClick={() => value.setIsOpen(true)}>setIsOpenTrue</div>
        <div onClick={() => value.setIsOpen(false)}>setIsOpenFalse</div>
        <div onClick={() => value.setModalContent(ModalContent)}>setModalContent</div>
        <div onClick={() => value.setModalProps({ one: 'prop', two: 'props'})}>setModalProps</div>
      </React.Fragment>
    )}
  </ModalContext.Consumer>
)
/* eslint-enable */

const renderModalProvider = renderComponent(ModalProvider)
  .withDefaultProps({
    children,
    Modal,
  });

describe('Modal Provider', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders the children', () => {
    const { output: { getByText } } = renderModalProvider();
    expect(getByText('the children')).toBeDefined();
  });

  it('renders the modal', () => {
    const { output: { getByText } } = renderModalProvider();
    expect(getByText('the modal')).toBeDefined();
  });

  describe('modal', () => {
    it('initializes with open false', () => {
      const { output: { queryByText } } = renderModalProvider();
      expect(queryByText('open')).toBeNull();
    });
    it('initializes with modal children as null', () => {
      const { output: { getByText } } = renderModalProvider();
      expect(getByText('null children')).toBeDefined();
    });
  });

  describe('setIsOpen', () => {
    it('sets the value of open on modal', async () => {
      const { output: { getByText } } = renderModalProvider();
      fireEvent.click(getByText('setIsOpenTrue'));
      await waitForElement(() => getByText('open'));
    });
  });

  describe('setModalContent', () => {
    it('sets the modal children', async () => {
      const { output: { getByText } } = renderModalProvider();
      fireEvent.click(getByText('setModalContent'));
      await waitForElement(() => getByText('modal children'));
    });
    it('defaults with props as empty', async () => {
      const { output: { getByText } } = renderModalProvider();

      fireEvent.click(getByText('setModalContent'));
      await waitForElement(() => getByText('additional prop length 0'));
    });
  });

  describe('setModalProps', () => {
    it('sets the additional modal props', async () => {
      const { output: { getByText } } = renderModalProvider();
      fireEvent.click(getByText('setModalContent'));
      await waitForElement(() => getByText('additional prop length 0'));
      fireEvent.click(getByText('setModalProps'));
      await waitForElement(() => getByText('additional prop length 2'));
    });
  });
});
