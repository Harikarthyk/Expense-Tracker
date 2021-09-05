import AsyncStorage from '@react-native-async-storage/async-storage';
import React , {useEffect} from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { setUserToStore } from '../redux/action/user';

var backgroundImage = require('../assets/splash.png');

const {height, width} = Dimensions.get('screen');

const SplashScreen = ({navigation,setUserToStore}) => {
useEffect(()=>{
  setTimeout(async () => {
    try{
      let jwtToken = await AsyncStorage.getItem('token');
      
      if (null !== jwtToken) {
        let user = await AsyncStorage.getItem('user');
        let parsedUser = JSON.parse(user);
        setUserToStore(parsedUser);
        navigation.replace('Tabs',{screen : 'Dashboard'});
      } else {
        navigation.replace('Auth');
      }
    }catch(error){
      console.log('-----------------------------SplashScreen LINE 34-------------------------------');
      console.log(error);
    }
  
  }, 0);

}, []);
  return (
    <ImageBackground source={backgroundImage} style={styles.imgContainer}>
      <StatusBar barStyle="default" />
      <View style={styles.imgBody}>
        <Text style={styles.header}>Expense Tracker</Text>
        <Text style={styles.body}>
          Let's track your expenses and start budgeting{' '}
        </Text>
      </View>
    </ImageBackground>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});
const mapDispatchToProps = dispatch => ({
  setUserToStore: user => dispatch(setUserToStore(user)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

const styles = StyleSheet.create({
  imgContainer: {
    height: height * 0.9,
    width: width * 1,
  },
  imgBody: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 20,
    marginBottom: height / 5,
  },
  header: {
    color: '#DCDCDC',
    fontSize: 40,
    marginTop: 40,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 20,
    color: '#C0C0C0',
  },
});
