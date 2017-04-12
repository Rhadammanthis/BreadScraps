import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
// import SongItem from './SongItem';

class SongsList extends Component {

    state = { albums: [] };

    componentWillMount() {
        // fetch('http://192.168.15.21:8080/api/getSaddestSongs', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'SpotifyAuth': 'BQCwpV1_r-ignkfe_q0Yg8dDabWljT0U83-5AL4OCmvkRApcZmqOzIF_T_2FovA_spOnIyOWatZSJWqvibqd0ahMiLVGTzZf7aIJJT4RrBZrDdDH0vzg6cN97wr96EwMN83OxpILpWhD5X8R',
        //     },
        //     form: {
        //         spotifyToken: accesToken,
        //         artistId: id,
        //         artistName: name,
        //     }
        // })
        //     .then((response) => response.json())
        //     .then((responseJson) => {
        //         this.setState({ albums: responseJson });
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });
    }

    renderAlbums() {
        return this.state.albums.map(song =>
            // <SongItem key={song.id} song={song}> </SongItem>
            <Text> song.name </Text>
        );
    }

    render() {
        console.log(this.state);
//  <ScrollView>
//                     {this.renderAlbums()}
//                 </ScrollView>
        return (
            <View>
                <Text> Some text </Text>
               
            </View>
        );
    }
}

export default SongsList;