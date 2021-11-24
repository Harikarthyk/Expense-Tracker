/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import App from './App';
import {createStore, applyMiddleware} from 'redux';
import {name as appName} from './app.json';
import rootReducer from './src/redux/reducer/rootReducer';
import {
  setCustomTextInput,
  setCustomText,
} from 'react-native-global-props';


const store = createStore(rootReducer);

const NewApp = () => {
  setCustomText({
    style: {          
      fontFamily: 'NotoSans-Regular',              
    }
  });
  setCustomTextInput({
    style: {          
      fontFamily: 'NotoSans-Regular',              
    }
  });
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  };
  
  AppRegistry.registerComponent(appName, () => NewApp);