import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react'
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity , Image, Linking } from 'react-native'
import normalize from 'react-native-normalize'
import { List } from 'react-native-paper';
import { theme } from '../core/theme';

function ProfileScreen({navigation}) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.white }}>
            <View
                style={{
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: normalize(20),
                }}>
                <View
                    style={{
                        flex: 1,
                        // justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignSelf :"flex-end",
                        alignItems: 'flex-end',
                        justifyContent: "flex-end"
                    }}>
                    {/* <Text style={{ fontSize: normalize(16), marginLeft: normalize(10) }}>
                        Settings
                    </Text> */}
                    <TouchableOpacity
                        style={{ backgroundColor: theme.colors.primary, borderRadius: normalize(9) }}
                        onPress={() => {
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
                        }}>
                        <Text
                            style={{
                                paddingHorizontal: normalize(9),
                                textAlign: 'center',
                                fontSize: normalize(16),
                                color: theme.colors.white,
                                fontWeight: 'bold',
                                padding: normalize(8),
                                paddingHorizontal: normalize(15),

                            }}>
                            Log out
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ padding: normalize(15) }}>
               
                <TouchableOpacity
                    style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        padding: normalize(5),
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E5E5E5',
                    }}
                    onPress={() => {
                        Linking.openURL('https://www.patreon.com/harikarthyk');
                    }}>
                    <Text style={{ fontWeight: '600', fontSize: normalize(19), lineHeight : normalize(31.23) }}>
                        Support us
                    </Text>
                    <List.Icon icon="credit-card-refund" color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        padding: normalize(5),
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E5E5E5',
                    }}
                    onPress={() => {
                        Linking.openURL('mailto:hari.jsmith494@gmaiil.com');
                    }}>
                    <Text style={{  fontWeight: '600', fontSize: normalize(19), lineHeight : normalize(31.23) }}>
                        Contact us
                    </Text>
                    <List.Icon icon="contacts" color={theme.colors.primary} />
                </TouchableOpacity>
                
               
                <Text
                style={{
                    color: "grey",
                    textAlign: 'center',
                    fontSize : normalize(14),
                    lineHeight: normalize(32.4),
                    fontWeight: "600"
                }}
                >© HACH 2021 v 0.0.1</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileScreen
