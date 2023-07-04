import React from 'react';
import { View } from 'react-native';
import { ListItem, Dialog, Text, Icon } from '@rneui/themed';

const LogoutButton = () => {
  const [visible, setVisible] = React.useState(false);

  const handleNoPress = () => {
    setVisible(false);
  };

  const handleYesPress = () => {
    setVisible(false);
  };

  return (
    <View>
      <ListItem onPress={() => setVisible(true)} testID="list-item-logout">
        <ListItem.Content>
          <ListItem.Title>Log Out</ListItem.Title>
        </ListItem.Content>
        <Icon name="log-out-outline" type="ionicon" />
      </ListItem>
      <Dialog isVisible={visible}>
        <Text>Are you sure you want to log out?</Text>
        <Dialog.Actions>
          <Dialog.Button onPress={handleYesPress}>Yes</Dialog.Button>
          <Dialog.Button onPress={handleNoPress}>No</Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

export default LogoutButton;
