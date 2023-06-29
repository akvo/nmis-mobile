import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomePage,
  FormActionPage,
  FormDataPage,
  GetStartedPage,
  AuthFormPage,
  FormPage,
} from '../pages';
import { UIState } from '../store';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const currentPage = UIState.useState((s) => s.currentPage);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={currentPage}>
      <Stack.Screen name="GetStarted" component={GetStartedPage} />
      <Stack.Screen name="AuthForm" component={AuthFormPage} />
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="FormAction" component={FormActionPage} />
      <Stack.Screen name="FormData" component={FormDataPage} />
      <Stack.Screen name="FormPage" component={FormPage} />
    </Stack.Navigator>
  );
};

const Navigation = (props) => {
  return (
    <NavigationContainer {...props}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
