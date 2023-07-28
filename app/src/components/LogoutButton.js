import React, { useState } from 'react';
import { View, Platform, ToastAndroid } from 'react-native';
import { ListItem, Dialog, Text, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { AuthState, UserState, FormState } from '../store';
import { conn, query } from '../database';
import { cascades } from '../lib';

const db = conn.init;

const LogoutButton = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleNoPress = () => {
    setVisible(false);
  };

  const handleYesPress = async () => {
    const tables = ['sessions', 'users', 'forms', 'config', 'datapoints'];
    const clearQuery = query.clear(tables);
    setLoading(true);
    await conn.tx(db, clearQuery);
    AuthState.update((s) => {
      s.token = null;
    });
    UserState.update((s) => {
      s.id = null;
      s.name = null;
      s.password = '';
    });
    setLoading(false);
    setVisible(false);

    FormState.update((s) => {
      s.form = {};
      s.questionGroups = [];
      s.question = [];
      s.currentValues = {}; // answers
      s.questionGroupListCurrentValues = {}; // answers for question group list component
      s.dataPointName = [];
    });

    /**
     * Remove sqlite files
     */
    await cascades.dropFiles();

    navigation.navigate('GetStarted');
  };

  return (
    <View>
      <ListItem onPress={() => setVisible(true)} testID="list-item-logout">
        <ListItem.Content>
          <ListItem.Title>Reset</ListItem.Title>
        </ListItem.Content>
        <Icon name="refresh" type="ionicon" />
      </ListItem>
      <Dialog testID="dialog-confirm-logout" isVisible={visible}>
        {loading ? (
          <Dialog.Loading />
        ) : (
          <Text>
            By resetting, you'll lose all saved data including users, forms and data-points. Are you
            sure?
          </Text>
        )}
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
