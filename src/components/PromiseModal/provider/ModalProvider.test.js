import React from 'react';
import { cleanup, fireEvent, waitForElement } from '@testing-library/react';
import renderComponent from '../../../testUtils/renderComponent';
import { ModalProvider, ModalContext } from './ModalProvider';

/* eslint-disable */
const Modal = ({ open, children, ...rest }) => (
  <React.Fragment>
    <div>the modal</div>
    {open ? <div>open</div> : null}
    {children === null ? <div>null children</div> : children}
    <div>additional prop length {Object.keys(rest).length}</div>
  </React.Fragment>
);

const children = (
  <ModalContext.Consumer>
    { value => (
      <React.Fragment>
        <div>the children</div>
        <div onClick={() => value.setIsOpen(true)}>setIsOpenTrue</div>
        <div onClick={() => value.setIsOpen(false)}>setIsOpenFalse</div>
        <div onClick={() => value.setModalChildren(<div>modal children</div>)}>setModalChildren</div>
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
    it('initializes with modal additional props as empty', () => {
      const { output: { getByText } } = renderModalProvider();
      expect(getByText('additional prop length 0')).toBeDefined();
    });
  });

  describe('setIsOpen', () => {
    it('sets the value of open on modal', async () => {
      const { output: { getByText } } = renderModalProvider();
      fireEvent.click(getByText('setIsOpenTrue'));
      await waitForElement(() => getByText('open'));
    });
  });

  describe('setModalChildren', () => {
    it('sets the modal children', async () => {
      const { output: { getByText } } = renderModalProvider();
      fireEvent.click(getByText('setModalChildren'));
      await waitForElement(() => getByText('modal children'));
    });
  });

  describe('setModalProps', () => {
    it('sets the additional modal props', async () => {
      const { output: { getByText } } = renderModalProvider();
      fireEvent.click(getByText('setModalProps'));
      await waitForElement(() => getByText('additional prop length 2'));
    });
  });
});
