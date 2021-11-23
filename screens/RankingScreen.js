import React from 'react'
import { StyleSheet, Text, View } from 'react-native';

function RankingScreen({navigation, route}) {
    return (
        <View style={styles.container}>
            <Text>{route.params.guid}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        
    }
})

export default RankingScreen
