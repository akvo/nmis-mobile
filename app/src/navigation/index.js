import React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
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
  AddUserPage,
  MapViewPage,
  UsersPage,
} from '../pages';
import { UIState, AuthState, UserState, FormState, BuildParamsState } from '../store';
import { BackHandler } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import { backgroundTask, notification } from '../lib';

const SYNC_FORM_VERSION_TASK_NAME = 'sync-form-version';
const SYNC_FORM_SUBMISSION_TASK_NAME = 'sync-form-submission';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

TaskManager.defineTask(SYNC_FORM_VERSION_TASK_NAME, async () => {
  try {
    await backgroundTask.syncFormVersion({
      sendPushNotification: notification.sendPushNotification,
      showNotificationOnly: true,
    });
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.error(`[${SYNC_FORM_VERSION_TASK_NAME}] Define task manager failed`, err);
    return BackgroundFetch.Result.Failed;
  }
});

TaskManager.defineTask(SYNC_FORM_SUBMISSION_TASK_NAME, async () => {
  try {
    console.log(`[${SYNC_FORM_SUBMISSION_TASK_NAME}]Function here...`);
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.error(`[${SYNC_FORM_SUBMISSION_TASK_NAME}] Define task manager failed`, err);
    return BackgroundFetch.Result.Failed;
  }
});

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const preventHardwareBackPressFormPages = ['Home', 'AddUser'];
  const currentPage = UIState.useState((s) => s.currentPage);
  const token = AuthState.useState((s) => s.token); // user already has session
  const userDefined = UserState.useState((s) => s.id);
  const syncInterval = BuildParamsState.useState((s) => s.dataSyncInterval);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!token || !preventHardwareBackPressFormPages.includes(currentPage)) {
        // Allow navigation if user is not logged in
        return false;
      }
      // Prevent navigation if user is logged in
      return true;
    });
    return () => backHandler.remove();
  }, [token, currentPage]);

  React.useEffect(() => {
    backgroundTask.backgroundTaskStatus(SYNC_FORM_VERSION_TASK_NAME);
    backgroundTask.backgroundTaskStatus(SYNC_FORM_SUBMISSION_TASK_NAME, syncInterval);

    notification.registerForPushNotificationsAsync();
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('[Notification]Received Listener');
    });
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('[Notification]Response Listener');
      backgroundTask.syncFormVersion({ showNotificationOnly: false });
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={currentPage}>
      {!token ? (
        <>
          <Stack.Screen name="GetStarted" component={GetStartedPage} />
          <Stack.Screen name="AuthForm" component={AuthFormPage} />
        </>
      ) : !userDefined ? (
        <Stack.Screen name="AddUser" component={AddUserPage} />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="ManageForm" component={ManageFormPage} />
          <Stack.Screen name="FormData" component={FormDataPage} />
          <Stack.Screen name="Settings" component={SettingsPage} />
          <Stack.Screen name="SettingsForm" component={SettingsFormPage} />
          <Stack.Screen name="FormPage" component={FormPage} />
          <Stack.Screen name="MapView" component={MapViewPage} />
          <Stack.Screen name="AddUser" component={AddUserPage} />
          <Stack.Screen name="Users" component={UsersPage} />
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
    if (['Home', 'ManageForm'].includes(currentRoute)) {
      // reset form values
      FormState.update((s) => {
        s.currentValues = {};
        s.questionGroupListCurrentValues = {};
        s.dataPointName = [];
      });
    }
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
