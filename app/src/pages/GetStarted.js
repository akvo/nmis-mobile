import React from 'react';
import { View } from 'react-native';
import { Text, Button } from '@rneui/themed';

const GetStarted = ({ navigation }) => {
  const goToLogin = () => {
    navigation.navigate('Home');
  };
  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        gap: 36,
      }}
    >
      <View style={{ width: 120, height: 120, backgroundColor: '#e5e7eb', borderRadius: 4 }} />
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <Text h4>Get Started</Text>
        <Text h4>collecting data the</Text>
        <Text h4>smart way</Text>
      </View>
      <Text>Lorem Ipsum dolor sit amet dolor random</Text>
      <Button title="primary" onPress={goToLogin}>
        Get Started
      </Button>
    </View>
  );
};

export default GetStarted;
