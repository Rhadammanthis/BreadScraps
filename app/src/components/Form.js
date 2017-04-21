import React, { Component } from 'react';
import { ScrollView, Text, Button, Linking } from 'react-native';
import { connect } from 'react-redux';
import { codeChanged } from '../actions';
import { Card, CardSection, Input, Spinner } from './common';

class Form extends Component {

    onEmailChange(text) {
        this.props.codeChanged(text);
    }

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

    onButtonPress() {
        Linking.openURL('http://192.168.1.71:3000');
    }

    render() {
        console.log(this.state);

        return (
            <ScrollView>
                <Text> Infinity Land </Text>
                <Input
                    label="Code"
                    placeholder="JFK32"
                    onChangeText={this.onEmailChange.bind(this)}
                    value={this.props.code}
                />
                <Button
                    onPress={this.onButtonPress.bind(this)}
                    title="Press Me"
                    accessibilityLabel="See an informative alert"
                />
            </ScrollView>
        );
    }
}

const mapStateToProps = ({ main }) => {

    const { code } = main;

    return {
        code
    };
};

export default connect(mapStateToProps, { codeChanged })(Form);