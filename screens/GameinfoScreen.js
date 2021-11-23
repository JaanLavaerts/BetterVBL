import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Linking   } from 'react-native';
import Swiper from 'react-native-swiper'
import { Entypo, MaterialCommunityIcons as MCI, FontAwesome5, Fontisto } from '@expo/vector-icons'; 
import { Link } from '@react-navigation/native';
import { sortFunction, isDateInPast } from '../functions'
import Game from '../components/Game';

function GameinfoScreen({navigation}, route) {
    return (
        <View>
            <Text>GameinfoScreen</Text>
        </View>
    )
}

export default GameinfoScreen
