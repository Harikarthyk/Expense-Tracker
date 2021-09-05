import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screen/Dashboard';
import normalize from 'react-native-normalize';
import { theme } from '../core/theme';
import { StyleSheet, View , Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AddTransaction from '../screen/AddTransaction';
import ProfileScreen from '../screen/ProfileScreen';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children,onPress}) => {
    return(
        <TouchableOpacity
            style={{
                top : normalize(-20),
                justifyContent : "center",
                alignItems : "center",
                ...styles.shadow,
            }}
            onPress={onPress}
        >
            <View style={{
                width : normalize(52),
                height : normalize(52),
                borderRadius : normalize(35),
                backgroundColor : theme.colors.primary,
            }}>
                {children}
            </View>
        </TouchableOpacity>
    )
}

const Tabs = () => {
    return (
        <Tab.Navigator 
          screenOptions={{
              tabBarShowLabel : false,
              tabBarStyle : {
                position : "absolute",
                bottom : normalize(25),
                left : normalize(40),
                right : normalize(40),
                elevation : 0,
                backgroundColor : theme.colors.white,
                height : normalize(63),
                borderRadius : normalize(15),
                ...styles.shadow
              },
              tabBarHideOnKeyboard: true
              
          }}
        >
            <Tab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{ 
                    headerShown: false, 
                    tabBarIcon : ({focused}) => {
                        return(
                            <View style={{
                                alignItems : "center",
                                justifyContent : "center",
                            }}>
                                <Icon name="appstore1" size={27} color={focused ? "#900" : theme.colors.unFocusedIcon} />
                                {/* <Text>Dashboard</Text> */}
                            </View>
                        )
                    } 
                }}
                
            />
            <Tab.Screen
                name="Add"
                component={AddTransaction}
                options={{ 
                    headerShown: false,
                    tabBarIcon : ({focused}) => {
                        return(
                            <Icon name="plus" size={30} color={theme.colors.white} />
                        )
                    },
                    tabBarButton : (props) => (
                        <CustomTabBarButton {...props} /> 
                    )
                }}
            /> 
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ 
                    headerShown: false, 
                    tabBarIcon : ({focused}) => {
                        return(
                            <View style={{
                                alignItems : "center",
                                justifyContent : "center",
                            }}>
                                <Icon name="user" size={27} color= {focused ?"#900"  :theme.colors.unFocusedIcon }  />
                                {/* <Text>Profile</Text> */}
                            </View>
                        )
                    } 
                }}
                
            />
        </Tab.Navigator>
    )
}
export default Tabs;


const styles = StyleSheet.create({
    shadow : {
        shadowColor : "#7F5DF0",
        shadowOffset:{
            width : 0,
            height : normalize(10),
        },
        shadowOpacity : normalize(.25),
        shadowRadius : normalize(3.5),
        elevation : normalize(5),
    }
})