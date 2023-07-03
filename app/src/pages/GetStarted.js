import React from 'react';
import { Text, Button } from '@rneui/themed';
import { CenterLayout, Image } from '../components';

const GetStarted = ({ navigation }) => {
  const goToLogin = () => {
    navigation.navigate('AuthForm');
  };

  const titles = ['Get Started', 'collecting data the', 'smart way'];
  return (
    <CenterLayout title={titles}>
      <Image />
      <CenterLayout.Titles items={titles} />
      <Text>Lorem Ipsum dolor sit amet dolor random</Text>
      <Button title="primary" onPress={goToLogin}>
        Get Started
      </Button>
    </CenterLayout>
  );
};

export default GetStarted;
