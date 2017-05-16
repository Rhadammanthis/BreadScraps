import React, { Component } from 'react';
import { ScrollView, Text, Button, Linking, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import { getSaddestSongs } from '../actions';
import { Card, CardSection, Input, Spinner } from './common';
import ArtistDetail from './ArtistDetail';

class SongList extends Component {

    componentWillMount() {

        console.log(this.props.artists)
        console.log(this.props.accesData)

        // this.props.getSaddestSongs(this.props.artists, this.props.accesData)

    }

    render() {

        const { searchContainerStyle, inputStyle, artistsTextStyle } = styles;

        if(this.props.saddestSongs !== null)
            console.log('Sad songs...', this.props.saddestSongs)

        return (
            <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 15
            }}>
                <Text style={artistsTextStyle}>
                    Song List
                </Text>
            </View>
        );
    }
}

const styles = {
    searchContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginRight: 10
    },
    inputStyle: {
        height: 40,
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 15
    },
    artistsTextStyle: {
        color: 'white',
        fontSize: 30
    }
}

const mapStateToProps = ({ artist, login, songList }) => {

    const { artists } = artist;
    const { accesData } = login;
    const { saddestSongs } = songList;

    return {
        artists, accesData, saddestSongs
    };
};

export default connect(mapStateToProps, { getSaddestSongs })(SongList);
// export default SongList