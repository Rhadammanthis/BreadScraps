import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Router from './Router';
// import Header from './components/common/Header';
// import Login from './components/Login'

class App extends Component {

    componentWillMount() {
        var config = {
          apiKey: "AIzaSyB42xJH08TpCmIorfCtcIv_q4mdB5DqrIo",
          authDomain: "bread-scraps.firebaseapp.com",
          databaseURL: "https://bread-scraps.firebaseio.com",
          projectId: "bread-scraps",
          storageBucket: "bread-scraps.appspot.com",
          messagingSenderId: "502353067063"
        };

        firebase.initializeApp(config);
    }

    render() {
        const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

        return (
            <Provider store={store}>
                {/*<View style={{ backgroundColor: '#191414', flex: 1 }}>
                    <Text> THERE IS BONES IN THE CHOCOLATE </Text>
                    <Form />
                    <Login />
                </View>*/}
                <Router />
            </Provider>
        );
    }
}

export default App;