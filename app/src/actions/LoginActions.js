import firebase from 'firebase';
import _ from 'lodash';
// import { Actions } from 'react-native-router-flux';
import {
    ID_CHANGED,
    ACCES_DATA
} from './types'

export const idChanged = (text) => {
    return {
        type: ID_CHANGED,
        payload: text
    };
};

export const requestAccesData = (code) => {

    return (dispatch) => {
        firebase.database().ref(`/users`)
            .orderByChild("trackId").equalTo(code).once('value', snapshot => {
                var userAccesData = _.map(snapshot.val(), (val, index) => {
                    return val;
                })
                // console.log(userAccesData[0])
                dispatch({ type: ACCES_DATA, payload: userAccesData[0] });
            })
    }
};