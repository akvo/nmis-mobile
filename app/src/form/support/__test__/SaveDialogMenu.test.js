import React from 'react';
import SaveDialogMenu from '../SaveDialogMenu';
import { render, fireEvent } from '@testing-library/react-native';

describe('SaveDialogMenu component', () => {
  it('should not show dialog if visible prop false', () => {
    const wrapper = render(<SaveDialogMenu visible={false} setVisible={jest.fn()} />);

    const dialogElement = wrapper.queryByTestId('save-dialog-menu');
    expect(dialogElement).toBeDefined();
    expect(dialogElement.props.visible).toEqual(false);
  });

  it('should show dialog if visible prop true', () => {
    const wrapper = render(<SaveDialogMenu visible={true} setVisible={jest.fn()} />);

    const dialogElement = wrapper.queryByTestId('save-dialog-menu');
    expect(dialogElement).toBeDefined();
    expect(dialogElement.props.visible).toEqual(true);
  });

  it('should show Save and Exit button on dialog', () => {
    const wrapper = render(<SaveDialogMenu visible={true} setVisible={jest.fn()} />);

    const dialogElement = wrapper.queryByTestId('save-dialog-menu');
    expect(dialogElement).toBeDefined();

    const saveAndExitButtonElement = wrapper.queryByTestId('save-and-exit-button');
    expect(saveAndExitButtonElement).toBeDefined();
  });

  it('should show Exit without Saving button on dialog', () => {
    const wrapper = render(<SaveDialogMenu visible={true} setVisible={jest.fn()} />);

    const dialogElement = wrapper.queryByTestId('save-dialog-menu');
    expect(dialogElement).toBeDefined();

    const exitWithoutSavingButtonElement = wrapper.queryByTestId('exit-without-saving-button');
    expect(exitWithoutSavingButtonElement).toBeDefined();
  });

  it('should call handleOnSaveAndExit function onPress Save and Exit button', () => {
    const mockHandleOnSaveAndExit = jest.fn();

    const wrapper = render(
      <SaveDialogMenu
        visible={true}
        setVisible={jest.fn()}
        handleOnSaveAndExit={mockHandleOnSaveAndExit}
      />,
    );

    const dialogElement = wrapper.queryByTestId('save-dialog-menu');
    expect(dialogElement).toBeDefined();

    const saveAndExitButtonElement = wrapper.queryByTestId('save-and-exit-button');
    expect(saveAndExitButtonElement).toBeDefined();
    fireEvent.press(saveAndExitButtonElement);

    expect(mockHandleOnSaveAndExit).toBeCalledTimes(1);
  });

  it('should call handleOnExit function onPress Exit without Saving button', () => {
    const mockHandleExitWithoutSaving = jest.fn();

    const wrapper = render(
      <SaveDialogMenu
        visible={true}
        setVisible={jest.fn()}
        handleOnExit={mockHandleExitWithoutSaving}
      />,
    );

    const dialogElement = wrapper.queryByTestId('save-dialog-menu');
    expect(dialogElement).toBeDefined();

    const exitWithoutSavingButtonElement = wrapper.queryByTestId('exit-without-saving-button');
    expect(exitWithoutSavingButtonElement).toBeDefined();
    fireEvent.press(exitWithoutSavingButtonElement);

    expect(mockHandleExitWithoutSaving).toBeCalledTimes(1);
  });
});
