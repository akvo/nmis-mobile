import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { CenterLayout, Image } from '../components';
import { conn, query } from '../database';
import { UIState } from '../store';

const db = conn.init;

const GetStarted = ({ navigation }) => {
  const [showSplashScreen, setShowSplashScreen] = React.useState(true);

  React.useEffect(() => {
    // check session
    conn.tx(db, query.read('sessions', [])).then((sessions) => {
      if (!sessions?.rows?.length) {
        setShowSplashScreen(false);
        return false;
      }
      // get last session
      const session = sessions?.rows?._array[sessions?.rows?.length - 1];
      console.info('Session =>', session);
      UIState.update((s) => {
        s.currentPage = 'Home';
      });
      setTimeout(() => {
        navigation.navigate('Home');
      }, 100);
    });
  }, []);

  const goToLogin = () => {
    navigation.navigate('AuthForm');
  };

  if (showSplashScreen) {
    const titles = ['Splash Screen'];
    return (
      <CenterLayout title={titles}>
        <Image />
        <CenterLayout.Titles items={titles} />
        <Text>Welcome</Text>
      </CenterLayout>
    );
  }

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
