import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { GetStartedPage, HomePage } from '../pages';

export default function Navigation({ colorScheme }) {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStarted" component={GetStartedPage} />
      <Stack.Screen name="Home" component={HomePage} />
    </Stack.Navigator>
  );
}
