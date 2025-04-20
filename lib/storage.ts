import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Store any value (object or primitive) in AsyncStorage
 */
export async function storeItem<T>(key: string, value: T): Promise<void> {
   try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
   } catch (e) {
      console.error(`Error storing item [${key}]:`, e);
   }
}

/**
 * Retrieve any value from AsyncStorage
 */
export async function getItem<T>(key: string): Promise<T | null> {
   try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
   } catch (e) {
      console.error(`Error retrieving item [${key}]:`, e);
      return null;
   }
}

/**
 * Remove an item from AsyncStorage
 */
export async function removeItem(key: string): Promise<void> {
   try {
      await AsyncStorage.removeItem(key);
   } catch (e) {
      console.error(`Error removing item [${key}]:`, e);
   }
}

export default {
   store: storeItem,
   get: getItem,
   remove: removeItem
};
