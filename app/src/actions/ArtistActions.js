import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import {
    ARTIST_CHANGED,
    ARTIST_SELECTED,
    ARTIST_SEARCHED
} from './types'

export const artistChanged = (text) => {
    return {
        type: ARTIST_CHANGED,
        payload: text
    };
};

export const artistSelected = (artist) => {
    return {
        type: ARTIST_SELECTED,
        payload: artist
    };
}

export const searchArtist = (search) => {
    return (dispatch) => {
        fetch(`https://api.spotify.com/v1/search?q=${search}&type=artist`)
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch({ type: ARTIST_SEARCHED, payload: responseJson });
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

// export const requestAccesData = (code) => {

//     return (dispatch) => {
//         firebase.database().ref(`/users`)
//             .orderByChild("trackId").equalTo(code).once('value', snapshot => {
//                 var userAccesData = _.map(snapshot.val(), (val, index) => {
//                     return val;
//                 })
//                 // console.log(userAccesData[0])
//                 dispatch({ type: ACCES_DATA, payload: userAccesData[0] });

//                 Actions.form();
//             })
//     }
// };