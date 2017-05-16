import { 
    SONGLIST_GETSONGS
 } from '../actions/types'

const INITIAL_STATE = { 
    saddestSongs: null,
 };

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case SONGLIST_GETSONGS:
            return { ...state, saddestSongs: action.payload };
        default:
            return state;
    }
};