import React from 'react';
import { View } from 'react-native';
import { Text, Header } from '@rneui/themed';

const Home = () => {
  return (
    <View>
      <Header
        centerComponent={{ text: 'Home', style: { color: '#fff' } }}
        rightComponent={{ icon: 'ellipsis-vertical', type: 'ionicon', color: '#fff' }}
      />
      <Text>Home</Text>
    </View>
  );
};

export default Home;
