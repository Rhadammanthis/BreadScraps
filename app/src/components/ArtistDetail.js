import React from 'react';
import { Text, View, Image, Linking, TouchableOpacity  } from 'react-native';
import { connect } from 'react-redux';
import { artistSelected } from '../actions';

const ArtistDetail = ({ artist, artistSelected }) => {
    const { name, images } = artist;
    const { thumbnailStyle,
        headerContentStyle,
        thumbnailContainerStyle,
        headerTextStyle,
        imageStyle } = styles;

    const url = images[2] ? images[2].url : "https://assets.audiomack.com/default-artist-image.jpg";

    return (
        <TouchableOpacity  style={{ flexDirection: 'row', padding: 10 }} onPress={() => {artistSelected(artist)}}>
            <Image
                style={thumbnailStyle}
                source={{ uri: url }}
            />
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginLeft: 20 }}>
                <Text style={headerTextStyle}>{name}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = {
    headerContentStyle: {
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    headerTextStyle: {
        color: 'white',
        fontSize: 20,
        marginTop: 5
    },
    thumbnailStyle: {
        height: 60,
        width: 60
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    imageStyle: {
        height: 300,
        flex: 1,
        width: null
    }
};

export default ArtistDetail