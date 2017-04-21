import { 
    ID_CHANGED,
    ACCES_DATA
 } from '../actions/types'

const INITIAL_STATE = { 
    id: '',
    accesData: {}
 };

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case ID_CHANGED:
            return { ...state, id: action.payload };
        case ACCES_DATA:
            return { ...state, accesData: action.payload}
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