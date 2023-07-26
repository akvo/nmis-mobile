import React from 'react';
import SaveDropdownMenu from '../SaveDropdownMenu';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

describe('SaveDialogMenu component', () => {
  it('should not show dropdown menu if visible prop false', () => {
    const wrapper = render(<SaveDropdownMenu visible={false} setVisible={jest.fn()} />);

    const dropdownMenuElement = wrapper.queryByTestId('save-dropdown-menu');
    expect(dropdownMenuElement).toBeDefined();
    expect(dropdownMenuElement.props.children[1]._owner.stateNode.props.visible).toEqual(false);
  });

  it('should show dropdown menu if visible prop true', () => {
    const wrapper = render(<SaveDropdownMenu visible={true} setVisible={jest.fn()} />);

    const dropdownMenuElement = wrapper.queryByTestId('save-dropdown-menu');
    expect(dropdownMenuElement).toBeDefined();
    expect(dropdownMenuElement.props.children[1]._owner.stateNode.props.visible).toEqual(true);
  });

  it.todo('should show dropdown menu anchor')

  it.todo('should show dropdown menu anchor from anchor prop')

  it('should show Save and Exit button as dropdown menu item', async () => {
    const wrapper = render(<SaveDropdownMenu visible={true} setVisible={jest.fn()} />);

    const dropdownMenuElement = wrapper.queryByTestId('save-dropdown-menu');
    expect(dropdownMenuElement).toBeDefined();

    await waitFor(() => {
      const saveAndExitItemElement = wrapper.getByTestId('save-and-exit-menu-item');
      expect(saveAndExitItemElement).toBeDefined();
    });
  });

  it('should show Exit without Saving button as dropdown menu item', () => {
    const wrapper = render(<SaveDropdownMenu visible={true} setVisible={jest.fn()} />);

    const dropdownMenuElement = wrapper.queryByTestId('save-dropdown-menu');
    expect(dropdownMenuElement).toBeDefined();

    const exitWithoutSavingItemElement = wrapper.queryByTestId('exit-without-saving-menu-item');
    expect(exitWithoutSavingItemElement).toBeDefined();
  });

  it('should show Language Selection button as dropdown menu item', () => {
    const wrapper = render(<SaveDropdownMenu visible={true} setVisible={jest.fn()} />);

    const dropdownMenuElement = wrapper.queryByTestId('save-dropdown-menu');
    expect(dropdownMenuElement).toBeDefined();

    const languageSelectionItemElement = wrapper.queryByTestId('language-selection-menu-item');
    expect(languageSelectionItemElement).toBeDefined();
  });

  it('should call handleOnSaveAndExit function onPress Save and Exit button', () => {
    const mockHandleOnSaveAndExit = jest.fn();

    const wrapper = render(
      <SaveDropdownMenu
        visible={true}
        setVisible={jest.fn()}
        handleOnSaveAndExit={mockHandleOnSaveAndExit}
      />,
    );

    const dropdownMenuElement = wrapper.queryByTestId('save-dropdown-menu');
    expect(dropdownMenuElement).toBeDefined();

    const saveAndExitItemElement = wrapper.queryByTestId('save-and-exit-menu-item');
    expect(saveAndExitItemElement).toBeDefined();
    console.log(saveAndExitItemElement);

    expect(mockHandleOnSaveAndExit).toHaveBeenCalledTimes(1);
  });

  it.todo('should call handleOnExit function onPress Exit without Saving button');

  it.todo('should show Language selection popup onPress Language Selection button');

  it.todo('should update activeLang when select a language on Language selection popup');
});
