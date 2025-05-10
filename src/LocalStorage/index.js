import AsyncStorage from '@react-native-async-storage/async-storage';

class AppLocalStorage {
    componentDidMount() {
        this._StoreData.done();
        this._GetStoredData().done();
        this._RemoveStoredData.done();
    }

    _StoreData = async (key, value) => {
        const data = JSON.stringify(value);
        try {
            await AsyncStorage.setItem(key, data);
        } catch (error) {
            console.log(error.message);
        }
    };

    _GetStoredData = async key => {
        let retrievedData;
        try {
            retrievedData = await AsyncStorage.getItem(key);
            return JSON.parse(retrievedData);
        } catch (error) {
            console.log(error.message);
        }
        return JSON.parse(retrievedData);
    };

    _RemoveStoredData = async key => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.log(error.message);
        }
    };
}

export const Preferences = new AppLocalStorage();
