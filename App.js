import React from 'react';
import HomeScreen from './screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native';
import RankingScreen from './screens/RankingScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Clubinfo from './screens/Clubinfo';
import GameinfoScreen from './screens/GameinfoScreen';
import Teaminfo from './screens/Teaminfo';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>      
        <Stack.Navigator>        
          <Stack.Screen          
            name="Home"          
            component={HomeScreen}          
            options={{ title: 'Home' }}        
          />  
          <Stack.Screen 
            name="Clubinfo" 
            component={Clubinfo}
            options={{ title: 'Clubinfo' }}       
            />   
          <Stack.Screen 
            name="Teaminfo" 
            component={Teaminfo}
            options={{ title: 'Teaminfo' }}       
            />         
          </Stack.Navigator>   
      </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {

  },
});
