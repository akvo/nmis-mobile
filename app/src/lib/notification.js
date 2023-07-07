import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const registerForPushNotificationsAsync = async () => {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('[Notification]Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.warn('[Notification]Must use physical device for Push Notifications');
  }
  return token;
};

const sendPushNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'New Form version available',
      body: 'Here is the notification body',
      data: null,
    },
    trigger: null,
  });
};

const notificationHandler = () => {
  return {
    registerForPushNotificationsAsync,
    sendPushNotification,
  };
};

const notification = notificationHandler();
export default notification;
