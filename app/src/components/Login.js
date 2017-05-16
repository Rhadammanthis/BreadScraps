import React, { Component } from 'react';
import { ScrollView, Text, Button, Linking, View, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { idChanged, requestAccesData } from '../actions';
import firebase from 'firebase';
import _ from 'lodash';
import { Card, CardSection, Spinner } from './common';

class Login extends Component {

    state = { shouldRenderInput: false };
    shouldRenderInput = false

    componentWillMount() {
        // fetch('https://rallycoding.herokuapp.com/api/music_albums')
        //     .then((response) => response.json())
        //     .then((responseJson) => {
        //         this.setState({ albums: responseJson });
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });

    }

    onIdChange(text) {
        this.props.idChanged(text);
    }

    onButtonPress() {

        var url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=code';
        url += '&client_id=' + encodeURIComponent('749748f5ea93499ea4177c896e6adef8');
        url += '&redirect_uri=' + encodeURIComponent('https://bread-scraps.firebaseapp.com/auth');
        url += '&state=' + encodeURIComponent('fromapp');

        Linking.openURL(url);
        this.setState({ shouldRenderInput: true })
    }

    renderInput() {
        // if (this.state.shouldRenderInput) {
            return (
                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <TextInput
                        style={{
                            height: 40,
                            flex: 1,
                            backgroundColor: 'white',
                            borderRadius: 10,
                            margin: 15
                        }}
                        onChangeText={this.onIdChange.bind(this)}
                        value={this.props.id}
                    />
                </View>
            );
        // }

    }

    render() {

        if (this.props.id.length === 5 && _.isEmpty(this.props.accesData))
            this.props.requestAccesData(this.props.id)

        console.log(this.props.accesData)

        const { headerStyle, headerContainer, bodyContainer, instructions, input } = styles;

        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={headerContainer}>
                        <Text style={headerStyle}> Bread Scraps </Text>
                    </View>
                    <View style={bodyContainer}>
                        <Text style={instructions}>
                            We need you to sign in to your Spotify account.
                            Just press the button and comeback once you're finished
                        </Text>
                        <Button
                            onPress={this.onButtonPress.bind(this)}
                            title="Login to Spotify"
                            accessibilityLabel="See an informative alert"
                            color="#1DB954"
                        />
                        {this.renderInput()}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = {
    headerStyle: {
        color: 'white',
        fontSize: 40,
        marginTop: 20
        // borderWidth: 1,
        // borderRadius: 2,
        // borderColor: '#ddd',
        // borderBottomWidth: 0,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 2,
        // elevation: 1,
        // marginLeft: 5,
        // marginRight: 5,
        // marginTop: 10
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructions: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 20,
        paddingLeft: 15,
        paddingRight: 15
    },
    input: {
        height: 40,
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 15
    }
};

const mapStateToProps = ({ login }) => {

    const { id, accesData } = login;

    // console.log('AccesData', accesData)

    return {
        id, accesData
    };
};

export default connect(mapStateToProps, { idChanged, requestAccesData })(Login);
// export default Login