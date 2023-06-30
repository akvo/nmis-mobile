import React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomePage,
  FormActionPage,
  FormDataPage,
  GetStartedPage,
  AuthFormPage,
  FormPage,
  AddUserPage,
} from '../pages';
import { UIState, AuthState } from '../store';
import { BackHandler } from 'react-native';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const currentPage = UIState.useState((s) => s.currentPage);
  const token = AuthState.useState((s) => s.token); // user already has session

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!token || currentPage !== 'Home') {
        // Allow navigation if user is not logged in
        return false;
      }
      // Prevent navigation if user is logged in
      return true;
    });
    return () => backHandler.remove();
  }, [token, currentPage]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={currentPage}>
      {!token ? (
        <>
          <Stack.Screen name="GetStarted" component={GetStartedPage} />
          <Stack.Screen name="AuthForm" component={AuthFormPage} />
        </>
      ) : (
        <>
          <Stack.Screen name="AddUser" component={AddUserPage} />
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="FormAction" component={FormActionPage} />
          <Stack.Screen name="FormData" component={FormDataPage} />
          <Stack.Screen name="FormPage" component={FormPage} />
        </>
      )}
    </Stack.Navigator>
  );
};

const Navigation = (props) => {
  const navigationRef = useNavigationContainerRef();

  const handleOnChangeNavigation = (state) => {
    // listen to route change
    const currentRoute = state.routes[state.routes.length - 1].name;
    UIState.update((s) => {
      s.currentPage = currentRoute;
    });
  };

  return (
    <NavigationContainer ref={navigationRef} onStateChange={handleOnChangeNavigation} {...props}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
