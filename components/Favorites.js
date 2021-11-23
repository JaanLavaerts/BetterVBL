import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Linking, TouchableWithoutFeedback, Modal, Button  } from 'react-native';
import { Entypo, MaterialCommunityIcons as MCI, FontAwesome, Ionicons, MaterialCommunityIcons, Fontisto } from '@expo/vector-icons'; 

function Favorites(props) {

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };

    return (
        <ScrollView>
            <TouchableOpacity 
                onLongPress={() => toggleModal()}
                onPress={props.onPress}
                style={{flex: 1}}>
                <Text 
                    style={{
                        padding: 12, 
                        borderBottomWidth: 0.5, 
                        borderColor: '#000',
                        textAlign: 'left'}}> 
                        <Entypo name="star" size={14} color="#0076ff" /> {props.naam} 
                </Text>
                
            </TouchableOpacity>
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                    <TouchableOpacity activeOpacity={1} style={styles.centeredView} onPress={toggleModal}>
                        <View style={styles.modalView}>
                            <Text>Verwijder <Text style={{fontWeight: 'bold', color: '#0076ff'}}>{props.naam}</Text> uit favorieten?</Text>
                            <Text></Text>
                            <Button onPress={props.remove} color={"red"} title='Ja'></Button>
                        </View>
                        
                    </TouchableOpacity>
                </Modal>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 20,
      width: '85%',
      height: '17%',
      shadowColor: "#000",
      borderWidth: 1,
      borderColor: 'red',
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 100
    },
});

export default Favorites
