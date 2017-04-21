// import firebase from 'firebase';
// import { Actions } from 'react-native-router-flux';
import { 
    CODE_CHANGED
} from './types'

export const codeChanged = (text) => {
    return {
        type: CODE_CHANGED,
        payload: text
    };
};