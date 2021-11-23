import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Linking, TouchableWithoutFeedback, Modal, Button  } from 'react-native';
import { Entypo, MaterialCommunityIcons as MCI, FontAwesome5, Ionicons, MaterialCommunityIcons, Fontisto } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 



function Game(props) {

    const homeScore = props.uitslag.split("-")[0].trim()
    const awayScore = props.uitslag.split("-")[1].trim()
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };

    return (
        
    <TouchableOpacity
         style={{borderBottomWidth: 1, borderColor: '#ccc', paddingTop: 5, paddingBottom: 20, paddingTop: 20}}
         onPress={() => toggleModal()}>

        <View style={{flex:2,flexDirection:"row",justifyContent:'space-between'}}>
                <Text style={parseInt(homeScore) > parseInt(awayScore) && {fontWeight: 'bold'}}>{props.home}</Text>
                {parseInt(homeScore) > parseInt(awayScore) ? <Text style={{fontWeight: 'bold'}}><AntDesign name="caretright" size={12} color="#0076ff" /> {homeScore}</Text> : <Text>{homeScore}</Text>}
            </View>
            <View style={{flex:2,flexDirection:"row",justifyContent:'space-between'}}>
            <Text style={parseInt(homeScore) < parseInt(awayScore) && {fontWeight: 'bold'}}>{props.away}</Text>
                {parseInt(homeScore) < parseInt(awayScore) ? <Text style={{fontWeight: 'bold'}}><AntDesign name="caretright" size={12} color="#0076ff" /> {awayScore}</Text> : <Text>{awayScore}</Text>}
            </View>
                <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                    <TouchableOpacity activeOpacity={1} style={styles.centeredView} onPress={toggleModal}>
                        <View style={styles.modalView}>
                            <Text style={{fontSize: 30, fontWeight: 'bold', textAlign:'center', color: '#0076ff'}}>{homeScore} - {awayScore}</Text>
                            <Text></Text>
                            <Text style={{padding: 2}}><Entypo name="trophy" size={14} color="black" /> {props.poule}</Text>
                            <Text style={{padding: 2}}><Entypo name="location" size={14} color="black" /> {props.plaats}</Text>
                            <Text></Text>
                            <Text style={{padding: 2}}><Entypo name="calendar" size={14} color="black" /> {props.datum}</Text>
                            <Text style={{padding: 2}}><Fontisto name="clock" size={14} color="black" /> {props.tijd.replace('.', ':')}</Text>
                            <Text></Text>
                            <Text style={{padding: 2, color: 'blue'}} onPress={() => Linking.openURL("https://vblweb.wisseq.eu/Home/MatchDetail?wedguid="+props.guid)}>Meer Info</Text>
                        </View>
                        
                    </TouchableOpacity>
                </Modal>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      backgroundColor: "#fff",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingTop: 20,
      width: '85%',
      height: '32%',
      shadowColor: "#000",
      borderWidth: 1,
      borderColor: '#0076ff',
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 100
    },
});

export default Game
