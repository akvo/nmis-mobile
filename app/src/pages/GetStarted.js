import React from 'react';
import { View } from 'react-native';
import { Text, Button } from '@rneui/themed';

const GetStarted = ({ navigation }) => {
  return (
    <View>
      <Text>Get started</Text>
      <Button title="primary" onPress={() => navigation.navigate('Home')}>
        Get Started
      </Button>
    </View>
  );
};

export default GetStarted;
