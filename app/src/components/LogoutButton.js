import React, { useState } from 'react';
import { View, Platform, ToastAndroid } from 'react-native';
import { ListItem, Dialog, Text, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { AuthState } from '../store';
import { conn, query } from '../database';

const db = conn.init;

const LogoutButton = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleNoPress = () => {
    setVisible(false);
  };

  const handleError = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show('Logout Failed: Please try again later', ToastAndroid.LONG);
    }
  };

  const handleYesPress = () => {
    const table = 'sessions';
    const clearQuery = query.clear(table);
    console.log('clear', clearQuery);
    setLoading(true);
    conn
      .tx(db, clearQuery)
      .then(() => {
        AuthState.update((s) => {
          s.token = null;
        });
        navigation.navigate('GetStarted');
        setLoading(false);
        setVisible(false);
      })
      .catch(() => {
        handleError();
        setLoading(false);
        setVisible(false);
      });
  };

  return (
    <View>
      <ListItem onPress={() => setVisible(true)} testID="list-item-logout">
        <ListItem.Content>
          <ListItem.Title>Log Out</ListItem.Title>
        </ListItem.Content>
        <Icon name="log-out-outline" type="ionicon" />
      </ListItem>
      <Dialog testID="dialog-confirm-logout" isVisible={visible}>
        {loading ? <Dialog.Loading /> : <Text>Are you sure you want to log out?</Text>}
        <Dialog.Actions>
          <Dialog.Button onPress={handleYesPress} testID="dialog-button-yes">
            Yes
          </Dialog.Button>
          <Dialog.Button onPress={handleNoPress} testID="dialog-button-no">
            No
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

export default LogoutButton;
