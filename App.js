import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar';
import MainNavigation from './MainNavigation';
import { AuthProvider } from './src/utils/context';

export default function App() {
  return (
    <AuthProvider>
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor='#fff' />
      <MainNavigation />
    </NavigationContainer>
    </AuthProvider>
  );
}


