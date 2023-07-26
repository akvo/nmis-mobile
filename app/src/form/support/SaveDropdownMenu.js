import React from 'react';
import { Button } from '@rneui/themed';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

const SaveDropdownMenu = ({ anchor, visible, setVisible, handleOnSaveAndExit, handleOnExit }) => {
  return (
    <Menu
      animationDuration={0}
      visible={visible}
      anchor={
        anchor || (
          <Button
            testID="anchor-dropdown-menu"
            onPress={() => {
              if (setVisible) {
                setVisible(true);
              }
            }}
          >
            Show Menu
          </Button>
        )
      }
      onRequestClose={() => {
        if (setVisible) {
          return setVisible(false);
        }
      }}
      testID="save-dropdown-menu"
    >
      <MenuItem
        onPress={() => {
          if (handleOnSaveAndExit) {
            return handleOnSaveAndExit();
          }
        }}
        testID="save-and-exit-menu-item"
      >
        Save and Exit
      </MenuItem>
      <MenuItem
        onPress={() => {
          if (handleOnExit) {
            return handleOnExit();
          }
        }}
        testID="exit-without-saving-menu-item"
      >
        Exit without Saving
      </MenuItem>
      <MenuDivider />
      <MenuItem testID="language-selection-menu-item">Language Selection</MenuItem>
    </Menu>
  );
};

export default SaveDropdownMenu;
