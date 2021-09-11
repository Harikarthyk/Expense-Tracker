import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {} from '@react-navigation/core'
import { Alert } from 'react-native';
export const requestHandler = async (url, data, header, method , navigation = null) => {
    try {
        let response = await axios({
            method,
            url,
            data,
            headers: header
        });
        return response
    } catch (error) {
        console.log("error services", error);
        if(error.response.status === 401 ) {
            
            console.log("401", 401);   
            const clearData = async () => {
                try {
                    await AsyncStorage.removeItem('token');
                    navigation.replace('SplashScreen');
                    // setUserExists(false);
                } catch (error) {
                    console.error(error);
                }
            };
            clearData();
            if(navigation === null) {
                Alert.alert('Open the App Again');
                return;
            }
            navigation.replace('SplashScreen');
        }
        return(error.response)
    }
}
