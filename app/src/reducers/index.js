import { combineReducers } from 'redux';
import MainReducer from './MainReducer';
import LoginReducer from './LoginReducer'

export default combineReducers({
    main: MainReducer,
    login: LoginReducer
});