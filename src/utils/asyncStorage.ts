import AsyncStorage from '@react-native-async-storage/async-storage';

export const authTokenName = 'authToken';
// Note that AsyncStorage for mobile is, well.. async
// localStorage on web is not async

/**
 * Gets the site-stored authToken from AsyncStorage
 */
export async function getBearerToken() {
  try {
    return await AsyncStorage.getItem(authTokenName);
  } catch (e) {
    console.log('Error while getting bearer token: ', e);
  }
}

/**
 * Sets a returned token in AsyncStorage for attachment to later network requests
 * @param {*} token - A valid JWT authentication token
 */
export async function setBearerToken(token: string) {
  try {
    await AsyncStorage.setItem(authTokenName, token);
  } catch (e) {
    console.log('Error while setting bearer token: ', e);
  }
}
