import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomePage, FormActionPage, FormDataPage, GetStartedPage, AuthFormPage } from '../pages';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStarted" component={GetStartedPage} />
      <Stack.Screen name="AuthForm" component={AuthFormPage} />
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="FormAction" component={FormActionPage} />
      <Stack.Screen name="FormData" component={FormDataPage} />
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
