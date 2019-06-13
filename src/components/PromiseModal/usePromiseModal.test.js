/* eslint-disable no-console */
import React from 'react';
import { renderHook, act } from 'react-hooks-testing-library';
import { usePromiseModal } from '../PromiseModal';
import { ModalContext } from './provider/ModalProvider';
import { fail } from 'assert';

const setIsOpenMock = jest.fn();
const setModalContentMock = jest.fn();
const setModalPropsMock = jest.fn();

/* eslint-disable */
const wrapper = ({ children }) => 
<ModalContext.Provider 
value={{
  setIsOpen: setIsOpenMock,
  setModalContent: setModalContentMock,
  setModalProps: setModalPropsMock
}}
>
  {children}
</ModalContext.Provider >;
/* eslint-enable */


describe('usePromiseModal', () => {
  let result;
  beforeEach(() => {
    jest.clearAllMocks();
    const modalContent = 'Modal Content';
    ({ result } = renderHook(() => usePromiseModal(modalContent), { wrapper }));
  });
  it('initializes the Modal Children', () => {
    expect(setModalContentMock).toHaveBeenCalledWith('Modal Content');
  });

  describe('launchPromiseModal', () => {
    it('sets modal to open', () => {
      act(() => {
        result.current.launchPromiseModal();
      });
      expect(setIsOpenMock).toHaveBeenCalledWith(true);
    });
    it('sets modal props', () => {
      const modalProps = {
        some: 'props',
      };
      act(() => {
        result.current.launchPromiseModal({ modalProps });
      });
      expect(setModalPropsMock).toHaveBeenCalledWith(modalProps);
    });
    it('adds the actionProps to the Modal Props with function', () => {
      const actionProps = ['some'];
      act(() => {
        result.current.launchPromiseModal({ actionProps });
      });
      expect(setModalPropsMock).toHaveBeenCalledWith({
        some: expect.any(Function),
      });
    });
    it('overrides modalProps with actionProps', () => {
      const actionProps = ['some'];

      const modalProps = {
        some: 'other - props',
        more: 'stuff',
      };
      act(() => {
        result.current.launchPromiseModal({ actionProps, modalProps });
      });
      expect(setModalPropsMock).toHaveBeenCalledWith({
        some: expect.any(Function),
        more: 'stuff',
      });
    });
    describe('action prop', () => {
      it('closes the modal when called', () => {
        const actionProps = ['some'];

        act(() => {
          result.current.launchPromiseModal({ actionProps });
          setModalPropsMock.mock.calls[0][0].some();

          expect(setIsOpenMock).toHaveBeenCalledWith(false);
        });
      });
      it('resolves launchModal promise with action name when called', async () => {
        const actionProps = ['some'];
        let promise;
        act(() => {
          promise = result.current.launchPromiseModal({ actionProps });
        });
        let resolved = false;
        promise.then((res) => {
          resolved = true;
          expect(res).toEqual('some');
        });
        // stupid thing to make sure the promise had time to resolve incorrectly
        await Promise.resolve();
        expect(resolved).toBeFalsy();
        setModalPropsMock.mock.calls[0][0].some();
        // stupid thing to make sure the promise had time to resolve incorrectly
        await Promise.resolve();
        expect(resolved).toBeTruthy();
      });
    });
    describe('console warning', () => {
      const ogWarn = console.warn;
      beforeAll(() => {
        console.warn = jest.fn();
      });
      afterAll(() => {
        console.warn = ogWarn;
      });
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it('is logged if actionProps have the same props as modal props', () => {
        const actionProps = ['some', 'more'];

        const modalProps = {
          some: 'other - props',
          more: 'stuff',
        };
        act(() => {
          result.current.launchPromiseModal({ actionProps, modalProps });
        });
        expect(console.warn).toHaveBeenCalledWith('modalProp key(s) [some, more] are being overridden by actionProps. If you would like to use the ones from modalProps please remove them from actionProps.');
      });
    });
  });
});
