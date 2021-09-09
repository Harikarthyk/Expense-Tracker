import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screen/SplashScreen';
import Auth from './src/navigation/Auth';
import { Provider as PaperProvided , DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { theme } from './src/core/theme';
import Tabs from './src/navigation/Tabs';
import Dashboard from './src/screen/Dashboard';
import ProfileScreen from './src/screen/ProfileScreen';


const App = () => {
  const RootStack = createStackNavigator();
  return (
    <PaperProvided theme={theme}>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="SplashScreen">
          <RootStack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Auth"
            component={Auth}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Tabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </PaperProvided>
  );
};

export default App;