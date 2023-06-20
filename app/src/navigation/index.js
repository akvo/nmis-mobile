import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomePage, FormActionPage, FormDataPage } from '../pages';

export default function Navigation(props) {
  return (
    <NavigationContainer {...props}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="FormAction" component={FormActionPage} />
      <Stack.Screen name="FormData" component={FormDataPage} />
    </Stack.Navigator>
  );
}
