import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from 'react-native-normalize';
import { connect } from 'react-redux';
const { height, width } = Dimensions.get('screen');
import TextInput from '../components/TextInput';
import { Button } from 'react-native-paper';
import { theme } from '../core/theme';
import { requestHandler } from '../services/index';
import { API } from '../utils/url'
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from 'react-native-modal-loader';

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: "", error: false });
  const [password, setPassword] = useState({ value: "", error: false });
  const [name, setName] = useState({ value: "", error: false });
  const [visible, setVisible] = useState("login");
  const [loader, setLoader] = useState(false);

  const helper = async (path, inputData) => {
    try {
      setLoader(true);
      let method = "POST";
      let url = `${API}/${path}`;
      let headers = {
        'Content-Type': 'application/json'
      };
      let response = await requestHandler(url, inputData, headers, method, navigation);
      const { data } = response;
      console.log(data,'asnkoSNLK')
      setLoader(false);
      if (data?.success === true) {
        Toast.show('Lets move in');
        await AsyncStorage.setItem('user', JSON.stringify(data?.user));
        await AsyncStorage.setItem('token', JSON.stringify(data?.user?.jwtToken));
        navigation.replace('SplashScreen');
      } else {
        Toast.show(data?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('-----------------AuthScreen Line 50-----------------');
      console.log(error);
    }
  }

  const loginPressed = () => {
    let data = {
      email: email?.value.trim(),
      password: password.value
    };
    if (data?.email?.length <= 5) {
      setEmail({ error: 'Not valid Email' });
      return;
    }
    if (data?.password.length <= 5) {
      setPassword({ error: "Password must be minimum 6 characters" });
      return;
    }
    helper("user/login", data);
  };

  const registerPressed = () => {
    let data = {
      email: email?.value?.trim(),
      password: password?.value,
      name: name?.value
    };
    if (data?.email?.length <= 5) {
      setEmail({ error: 'Not valid Email' });
      return;
    }
    if (data?.password?.length <= 5) {
      setPassword({ error: "Password must be minimum 6 characters" });
      return;
    }
    helper("user/register", data);
  }


  const changeMode = (mode) => {
    setPassword({ value: "", error: '' });
    setEmail({ value: "", error: "" });
    setName({ value: "", error: "" })
    setVisible(mode);
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerText}>Expense Tracker</Text>
      </View>
      <Loader loading={loader} color={theme.colors.primary} />
      <View style={styles.footer}>
        <ScrollView style={{
          flex: 1
        }}>
          <View style={{ padding: normalize(30) }}>
            <Text style={{ color: '#4169E1', fontSize: normalize(34) }}>Welcome</Text>
            <Text style={{ fontSize: normalize(17), lineHeight: normalize(28.31), color: '#696969' }}>
              Let's keep track on expenses and start budget so you'll never run
              out of money again
            </Text>
            {visible === "login" && <View style={{
              width: '100%',
              alignSelf: "center",
              marginTop: normalize(20)
            }}>
              <Text style={{ color: theme.colors.black, fontSize: normalize(20), lineHeight: normalize(32.12) }}>Login to continue</Text>
              <KeyboardAvoidingView>
                <TextInput
                  label="Email"
                  returnKeyType="next"
                  value={email.value}
                  onChangeText={text => setEmail({ value: text, error: '' })}
                  error={!!email.error}
                  errorText={email.error}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                // autoFocus={true}
                />
                <TextInput
                  label="Password"
                  returnKeyType="next"
                  value={password.value}
                  onChangeText={text => setPassword({ value: text, error: '' })}
                  error={!!password.error}
                  errorText={password.error}
                  secureTextEntry
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={loginPressed}
                  mode="outlined"
                  style={{
                    backgroundColor: theme.colors.primary,
                    height: normalize(51)
                    , alignItems: "center",
                    justifyContent: "center",
                    marginTop: normalize(10)
                  }}
                  disabled={loader}
                >
                  <Text
                    style={{
                      color: theme.colors.white,
                      fontSize: normalize(18),
                    }}
                  >
                    Let's Go
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity

                  disabled={loader}
                  onPress={() => {
                    changeMode('register')
                  }}
                  style={{
                    marginVertical: normalize(7)
                  }}
                >
                  <Text style={{
                    color: theme.colors.black,
                    fontSize: normalize(17),
                    lineHeight: normalize(29.87),
                    textAlign: "center"
                  }}>
                    Don't have account ?
                  </Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </View>
            }
            {visible === "register" &&
              <View style={{
                width: '100%',
                alignSelf: "center",
                marginTop: normalize(20)
              }}>
                <Text style={{ color: theme.colors.black, fontSize: normalize(20), lineHeight: normalize(32.12) }}>Register yourself</Text>
                <KeyboardAvoidingView behavior="position">
                  <TextInput
                    label="Name"
                    returnKeyType="next"
                    value={name.value}
                    onChangeText={text => setName({ value: text, error: '' })}
                    error={!!name.error}
                    errorText={name.error}
                    autoCapitalize="none"
                  />
                  <TextInput
                    label="Email"
                    returnKeyType="next"
                    value={email.value}
                    onChangeText={text => setEmail({ value: text, error: '' })}
                    error={!!email.error}
                    errorText={email.error}
                    autoCapitalize="none"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                  />
                  <TextInput
                    label="Password"
                    returnKeyType="next"
                    value={password.value}
                    onChangeText={text => setPassword({ value: text, error: '' })}
                    error={!!password.error}
                    errorText={password.error}
                    secureTextEntry
                    returnKeyType="done"
                  />
                </KeyboardAvoidingView>
                <Button mode="outlined"

                  disabled={loader}
                  onPress={registerPressed}
                  style={{
                    backgroundColor: theme.colors.primary,
                    height: normalize(51)
                    , alignItems: "center",
                    justifyContent: "center",
                    marginTop: normalize(10)
                  }}
                  labelStyle={{
                    color: theme.colors.white,
                    fontSize: normalize(18),
                  }}
                >
                  Create your Account
                </Button>
                <TouchableOpacity

                  disabled={loader}
                  onPress={() => {
                    changeMode('login')
                  }}
                  style={{
                    marginVertical: normalize(7),
                  }}
                >
                  <Text style={{
                    color: theme.colors.black,
                    fontSize: normalize(17),
                    lineHeight: normalize(29.87),
                    textAlign: "center"
                  }}>
                    Already have account ?
                  </Text>
                </TouchableOpacity>
              </View>}
            <TouchableOpacity

              disabled={loader}
              onPress={() => {
                Linking.openURL(`https://expense-tracker-apinative.herokuapp.com/forgot-password`);
              }}
              style={{
                marginVertical: normalize(7)
              }}
            >
              <Text style={{
                color: theme.colors.black,
                fontSize: normalize(17),
                lineHeight: normalize(29.87),
                textAlign: "center"
              }}>
                Forgot Your Password ?
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});
export default connect(mapStateToProps, null)(AuthScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4169E1',
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#F5F5F5',
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  footer: {
    height: height / 1.4,
    backgroundColor: '#FFF',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
});
