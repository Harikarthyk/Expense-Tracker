import {combineReducers} from 'redux';

import category from './category';
import expense from './expense';
import income from './income';
import user from './user';

const rootReducer = combineReducers({user, income , expense,category});

export default rootReducer;