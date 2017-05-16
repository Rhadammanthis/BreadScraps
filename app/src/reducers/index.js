import { combineReducers } from 'redux';
import MainReducer from './MainReducer';
import LoginReducer from './LoginReducer';
import ArtistReducer from './ArtistsReducer';
import SongListReducer from './SongListReducer'

export default combineReducers({
    main: MainReducer,
    login: LoginReducer,
    artist: ArtistReducer,
    songList: SongListReducer
});