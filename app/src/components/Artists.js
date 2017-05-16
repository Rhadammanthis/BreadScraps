import React, { Component } from 'react';
import { ScrollView, Text, Button, Linking, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import { artistChanged, artistSelected, searchArtist } from '../actions';
import { Actions } from 'react-native-router-flux';
import { Card, CardSection, Input, Spinner } from './common';
import ArtistDetail from './ArtistDetail';

class Artists extends Component {

    // state = { searchResults: null };

    componentWillMount() {

    }

    onEmailChange(text) {
        this.props.codeChanged(text);
    }

    onArtistNameChanged(text) {
        this.props.artistChanged(text);
    }

    onArtistSelected(artist) {
        this.props.artistSelected(artist)
    }

    onSearchPress() {
        this.props.searchArtist(this.props.artistText)
    }

    onFinishedTyping() {
        this.props.searchArtist(this.props.artistText)
    }

    renderArtists() {
        if (this.props.searchResults !== null) {
            return this.props.searchResults.artists.items.map(artist =>
                <ArtistDetail key={artist.id} artist={artist} artistSelected={this.props.artistSelected}/>
            );
        }
    }

    renderSelectedArtists() {
        if(this.props.artists.length > 0){
            var selectedArtists = this.props.artists.map(artist => artist.name + ', ')
            return(
                <Text style={{ fontSize: 15, color: 'white', flex: 1 }}>
                        {selectedArtists}
                </Text>
            )
        }
    }

    render() {

        const { searchContainerStyle, inputStyle, artistsTextStyle } = styles;

        console.log('Selected srtists', this.props.artists)

        if(this.props.artists.length === 3)
            Actions.songs();

        return (
            <View style={{
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <View style={{ flexDirection: 'row' }}>
                    {this.renderSelectedArtists()}
                    <Text style={ artistsTextStyle }>
                        {this.props.artists.length}
                    </Text>
                </View>
                <View style={searchContainerStyle}>
                    <TextInput
                        style={inputStyle}
                        onChangeText={this.onArtistNameChanged.bind(this)}
                        value={this.props.artistText}
                        onSubmitEditing={this.onFinishedTyping.bind(this)}
                    />
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                        <Button
                            onPress={this.onSearchPress.bind(this)}
                            title="Search artist"
                            accessibilityLabel="See an informative alert"
                            color="#FF7F00"
                            style={{ height: 40, marginRight: 10 }}
                        />
                    </View>
                </View>
                <ScrollView style={{ marginBottom: 50 }}>
                    {this.renderArtists()}
                </ScrollView>
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

const mapStateToProps = ({ artist }) => {

    const { artistText, artists, searchResults } = artist;

    return {
        artistText, artists, searchResults
    };
};

export default connect(mapStateToProps, { artistChanged, artistSelected, searchArtist })(Artists);