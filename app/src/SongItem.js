import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';

const SongItem = ({ song }) => {
    const { name, artist } = song;
    const { artist, song } = styles;

    return (
        <View>
            <Text style={ song }> name </Text>
            <Text style={ artist }> artist </Text>
        </View>
    );
}

const styles = {
    artist: {
        fontSize: 17,
        color: '#0F0'
    },
    song: {
        fontSize: 25,
        color: '#F00'
    }
} 

export default SongItem;