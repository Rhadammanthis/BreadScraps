import { 
    ARTIST_CHANGED,
    ARTIST_SELECTED,
    ARTIST_SEARCHED
 } from '../actions/types'

const INITIAL_STATE = { 
    artistText: '',
    artists: [],
    searchResults: null
 };

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case ARTIST_CHANGED:
            return { ...state, artistText: action.payload };
        case ARTIST_SELECTED:
            return { ...state, artists: [...state.artists, action.payload]};
        case ARTIST_SEARCHED:
            return {...state, searchResults: action.payload}
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