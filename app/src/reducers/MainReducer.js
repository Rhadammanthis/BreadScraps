import { 
    CODE_CHANGED
 } from '../actions/types'

const INITIAL_STATE = { 
    code: ''
 };

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case CODE_CHANGED:
            return { ...state, code: action.payload };
        // case PASSWORD_CHANGED:
        //     return { ...state, password: action.payload };
        // case LOGIN_USER_SUCCESS:
        //     return { ...state, ...INITIAL_STATE, user: action.payload};
        // case LOGIN_USER_FAIL:
        //     return { ...state, error: 'Authentication Failed.', password: '', loading: false };
        // case LOGIN_USER:
        //     return { ...state, loading: true, error: '' };
        default:
            return state;
    }
};