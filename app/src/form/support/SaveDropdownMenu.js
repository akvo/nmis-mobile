import React from 'react';
import { Button } from '@rneui/themed';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { StyleSheet } from 'react-native';
import { config } from '../../pages/Settings/config';
import DialogForm from '../../pages/Settings/DialogForm';
import { UIState } from '../../store';

const userInterfaceConfigId = 2;

const SaveDropdownMenu = ({ anchor, visible, setVisible, handleOnSaveAndExit, handleOnExit }) => {
  const [showLanguageSelectionDialog, setShowLanguageSelectionDialog] = React.useState(false);

  const languageSelectionDialogConfig = React.useMemo(() => {
    const findFieldsConfig = config.find((x) => x.id === userInterfaceConfigId)?.fields || [];
    return findFieldsConfig.find((x) => x.name === 'lang') || {};
  }, []);

  const handleOnOk = (value) => {
    UIState.update((s) => {
      s.lang = value;
    });
    setShowLanguageSelectionDialog(false);
  };

  return (
    <>
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
        style={styles.dropdownContainer}
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
        <MenuItem
          testID="language-selection-menu-item"
          onPress={() => {
            setShowLanguageSelectionDialog(true);
            setVisible(false);
          }}
        >
          Language Selection
        </MenuItem>
      </Menu>
      <DialogForm
        onOk={handleOnOk}
        onCancel={() => setShowLanguageSelectionDialog(false)}
        showDialog={showLanguageSelectionDialog}
        edit={languageSelectionDialogConfig}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginTop: 50,
  },
});

export default SaveDropdownMenu;
