import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar';
import MainNavigation from './MainNavigation';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor='#fff' />
      <MainNavigation />
    </NavigationContainer>
  );
}


