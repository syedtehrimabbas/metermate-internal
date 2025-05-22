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