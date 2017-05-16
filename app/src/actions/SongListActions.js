import _ from 'lodash';
import async from 'async';
import { Actions } from 'react-native-router-flux';
import {
    SONGLIST_GETSONGS
} from './types'

export const getSaddestSongs = (artists, accesData) => {
    return (dispatch) => {

        async.map(artists, (artist, callback) => {

            console.log(artist)

            fetch(`https://bs.hugomedina.me/api/getSaddestSongs`, {
                method: "POST", headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    spotifyToken: 'BQApvLjted7fp0iIUJA8GJlxDVVHdLEAl-rLmSk2K_1tymXVbnzxC_nz6NdHJn_54ULX4HuY9kkdNk5yt1FvalaWGxuwhb8uIfvg1jUnCIt_KXnGzBT8SWzbKugzFpwSv5Vx2vswLEnkSYc8',
                    artistId: artist.id,
                    artistName: artist.name
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    callback(null, responseJson);
                })
                .catch((error) => {
                    callback(error);
                });

        }, (asyncError, asyncResults) => {
            if (asyncError) {
                dispatch({ type: SONGLIST_GETSONGS, payload: asyncError });
            } else {
                dispatch({ type: SONGLIST_GETSONGS, payload: asyncResults });
            }
        });

    }
}