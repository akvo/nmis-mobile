import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@rneui/themed';
import { Title } from '../components';

const Start = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Title>
        Get started{'\n'}collecting data{'\n'}the smart way
      </Title>
      <Button title="solid" onPress={() => navigation.navigate('AuthForm')}>
        Get Started
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Start;
