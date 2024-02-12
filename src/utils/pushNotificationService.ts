// eslint-disable-next-line import/no-extraneous-dependencies
import * as Notifications from 'expo-notifications';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function sendPushNotification(expoPushToken: string): Promise<void> {
  try {
    // Check if a notification has been sent in the last 24 hours
    const lastNotificationTime = await AsyncStorage.getItem('lastNotificationTime');
    const currentTime = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
    if (lastNotificationTime) {
      const lastNotificationTimestamp = parseInt(lastNotificationTime, 10);
      if (currentTime - lastNotificationTimestamp < twentyFourHours) {
        console.log('Notification already sent within the last 24 hours');
        return;
      }
    }
  
    // Prepare notification message
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'New Jobs Available!',
      body: 'Open the app to see the latest jobs available.',
      data: { someData: 'goes here' },
    };
  
    // Send push notification
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  
    // Update last notification time
    await AsyncStorage.setItem('lastNotificationTime', currentTime.toString());
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

export async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
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
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants?.expoConfig?.extra?.eas.projectId,
    })).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }
  
  return token;
}