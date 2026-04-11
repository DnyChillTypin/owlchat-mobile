import AsyncStorage from '@react-native-async-storage/async-storage';

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error('Error reading from AsyncStorage', e);
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error('Error writing to AsyncStorage', e);
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Error deleting from AsyncStorage', e);
    }
  }
};
