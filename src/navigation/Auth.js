import React from 'react';
import { createStackNavigator } from "@react-navigation/stack"
import AuthScreen from '../screen/AuthScreen';
const AuthStack = createStackNavigator();
export default Auth = ({navigation}) => {
    return(
        <AuthStack.Navigator initialRouteName="AuthScreen">
            <AuthStack.Screen 
                name="AuthScreen"
                component={AuthScreen}
                options={{headerShown : false}}
            />
        </AuthStack.Navigator>
    )
}