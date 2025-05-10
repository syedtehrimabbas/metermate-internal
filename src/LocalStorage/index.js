import AsyncStorage from '@react-native-async-storage/async-storage';

class MeterMateEncryptedStorage {
  static USER_KEY = 'user';
  static JWT_KEY = 'jwt';

  static async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving data for key "${key}":`, error);
    }
  }

  static async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving data for key "${key}":`, error);
      return null;
    }
  }

  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key "${key}":`, error);
    }
  }

  static async clearAll() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  }
}

export default MeterMateEncryptedStorage;

export async function getUserData() {
  try {
    const userDataString = await AsyncStorage.getItem('user_data');
    if (userDataString !== null) {
      const userData = JSON.parse(userDataString);
      // console.log('User Data:', userData);
      return userData;
    } else {
      console.log('No user data found');
      return null;
    }
  } catch (e) {
    console.log('Error reading user data from AsyncStorage:', e);
    return null;
  }
}

export async function getUserId() {
  const user = await getUserData();
  return user?.id ?? null;
}