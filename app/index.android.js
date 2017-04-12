//Index.android.js - place code in here for android!

// Import a library to help create a component
import React from 'react';
import { AppRegistry, View } from 'react-native';
import Header from './src/components/Header';
import SongsList from './src/SongsList';

// Create a component
const App = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#40404C' }}>
      <Header headerText={' Bread Scraps'} />
      <SongsList> </SongsList>
    </View>
  );
};

// Render it to a device
AppRegistry.registerComponent('app', () => App);