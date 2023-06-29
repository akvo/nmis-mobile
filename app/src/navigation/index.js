import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomePage,
  ManageFormPage,
  FormDataPage,
  GetStartedPage,
  AuthFormPage,
  SettingsPage,
  SettingsFormPage,
  FormPage,
} from '../pages';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStarted" component={GetStartedPage} />
      <Stack.Screen name="AuthForm" component={AuthFormPage} />
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="ManageForm" component={ManageFormPage} />
      <Stack.Screen name="FormData" component={FormDataPage} />
      <Stack.Screen name="Settings" component={SettingsPage} />
      <Stack.Screen name="SettingsForm" component={SettingsFormPage} />
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
