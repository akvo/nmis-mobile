import React from 'react';
import { View } from 'react-native';
import { Text, Button } from '@rneui/themed';
import * as Crypto from 'expo-crypto';
import { BaseLayout } from '../components';
import { conn, query } from '../database';

db = conn.init;
const UserProfile = ({ navigation }) => {
  const handleSavePress = async () => {
    const table = 'users';
    const id = 1;
    const name = 'Dummy';
    const password = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, 'secret');
    const data = {
      id,
      name,
      password,
    };
    const insertQuery = query.insert(table, data);
    const { insertId, ...result } = await conn.tx(db, insertQuery);
    console.log('res', result);
    if (insertId) {
      navigation.navigate('Home');
    }
  };
  return (
    <BaseLayout title="My Profile">
      <View>
        <Text>Hello</Text>
        <Button onPress={handleSavePress}>Save</Button>
      </View>
    </BaseLayout>
  );
};

export default UserProfile;
