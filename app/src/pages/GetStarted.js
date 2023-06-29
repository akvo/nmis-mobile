import React from 'react';
import { Text, Button } from '@rneui/themed';
import { CenterLayout, Image } from '../components';
import { crudSessions } from '../database/crud';
import { UIState } from '../store';

const GetStarted = ({ navigation }) => {
  const [showSplashScreen, setShowSplashScreen] = React.useState(true);

  React.useEffect(() => {
    // check session
    crudSessions.selectLastSession().then((res) => {
      if (!res) {
        setShowSplashScreen(false);
        return false;
      }
      console.info('Session =>', res);
      UIState.update((s) => {
        s.currentPage = 'Home';
      });
      setTimeout(() => {
        navigation.navigate('Home');
      }, 50);
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
