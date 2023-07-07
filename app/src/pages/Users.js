import React, { useState, useEffect } from 'react';
import { ScrollView, BackHandler, Platform, ToastAndroid } from 'react-native';
import { Button, ListItem, Skeleton } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';

import { BaseLayout } from '../components';
import { conn, query } from '../database';
import { UserState } from '../store';

const db = conn.init;

const Users = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const currUserID = UserState.useState((s) => s.id);

  const goToCreate = () => {
    navigation.navigate('AddUser');
  };

  const goToHome = () => {
    navigation.navigate('Home');
  };

  const loadUsers = () => {
    const selectQuery = query.read('users');
    conn
      .tx(db, selectQuery)
      .then(({ rows }) => {
        setUsers(rows._array);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleSelectUser = async (id, name) => {
    try {
      const currUserQuery = query.update('users', { id: currUserID }, { active: 0 });
      await conn.tx(db, currUserQuery, [currUserID]);

      const thisUserQuery = query.update('users', { id }, { active: 1 });
      await conn.tx(db, thisUserQuery, [id]);

      UserState.update((s) => {
        s.id = id;
        s.name = name;
      });
      loadUsers();

      if (Platform.OS === 'android') {
        ToastAndroid.show(`Switch to ${name}`, ToastAndroid.SHORT);
      }
    } catch {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Unable to switch user', ToastAndroid.SHORT);
      }
    }
  };

  useEffect(() => {
    if (loading) {
      loadUsers();
    }
    if (!loading && route?.params?.added) {
      const newUser = route.params.added;
      const findNew = users.find((u) => {
        return u.id === newUser?.id;
      });
      if (!findNew) {
        setLoading(true);
      }
    }
  }, [loading, route]);

  useEffect(() => {
    const handleBackPress = () => {
      goToHome(); // Change the destination force to 'Home'
      return true; // Return true to prevent default back behavior
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      backHandler.remove(); // Cleanup the event listener on component unmount
    };
  }, []);

  return (
    <BaseLayout
      title="Users"
      leftComponent={
        <Button type="clear" onPress={goToHome} testID="arrow-back-button">
          <Icon name="arrow-back" size={18} />
        </Button>
      }
      rightComponent={
        <Button type="clear" testID="button-users" onPress={goToCreate}>
          <Icon name="add" size={18} />
        </Button>
      }
    >
      <ScrollView>
        {loading && <Skeleton animation="wave" />}
        {users.map((user, index) => {
          return (
            <ListItem.Swipeable
              key={index}
              onPress={async () => await handleSelectUser(user.id, user.name)}
              rightContent={(reset) => (
                <Button
                  title="Delete"
                  onPress={() => reset()}
                  icon={{ name: 'delete', color: 'white' }}
                  buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
              )}
              bottomDivider
            >
              <ListItem.Content>
                <ListItem.Title>{user.name}</ListItem.Title>
              </ListItem.Content>
              {user.active === 1 && <Icon name="checkmark" size={18} />}
            </ListItem.Swipeable>
          );
        })}
      </ScrollView>
    </BaseLayout>
  );
};

export default Users;
