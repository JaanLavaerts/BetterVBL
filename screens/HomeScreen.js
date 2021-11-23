import React, { useState, useEffect }  from 'react'
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, ScrollView, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import clubguis from '../data/ClubGui.json'
import Favorites from '../components/Favorites';
import Swiper from 'react-native-swiper';


function HomeScreen({ navigation }) {

    const [clubs, setClubs] = useState(Object.keys(clubguis))
    const [filteredClubs, setFilteredClubs] = useState(Object.keys(clubguis))
    const [search, setSearch] = useState('');
    const [favoriteTeams, setFavoriteTeams] = useState([]);
    const [favoriteClubs, setFavoriteClubs] = useState([]);

    const searchFilter = (text) => {
        if (text) {
            const newData = clubs.filter((item) => {
                const itemData = item ? item.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setFilteredClubs(newData)
            setSearch(text)
        }
        else {
            setFilteredClubs(clubs)
            setSearch(text)
        }
    }

    const getStorageTeams = async () => {
        const teams = await AsyncStorage.getItem('favTeams')
        if (teams !== null) {
            setFavoriteTeams(prevState => [...prevState, ...JSON.parse(teams)])
        }
    }

    const getStorageClubs = async () => {
        const clubs = await AsyncStorage.getItem('favClubs')
        if (clubs !== null) {
            setFavoriteClubs(prevState => [...prevState, ...JSON.parse(clubs)])
        }
    }

    const setStorageClubs = async (club) => {
        let clubs = [];
        try {
          let storedClubs = await AsyncStorage.getItem('favClubs');
          if (storedClubs !== null) {
            clubs = JSON.parse(storedClubs); 
          }
          clubs.push(club)
          await AsyncStorage.setItem('favClubs', JSON.stringify(clubs));
          Alert.alert('Club toegevoegd aan favorieten. Herstart de app.')
        } catch (error) {
        }
    };

    const removeFromStorage = async (name, storage) => {
        const teams = await AsyncStorage.getItem(storage)
        parsed = JSON.parse(teams)
        parsed.splice(parsed.indexOf(name), 1)
        setFavoriteTeams(parsed)
    }

    const clearAsyncStorage = async() => {
        setFilteredClubs([])
        setFavoriteTeams([])
        AsyncStorage.clear();
    }

    useEffect(() => {
        getStorageTeams()
        getStorageClubs()
    }, [])

    return (

        <Swiper loop={false} showsHorizontalScrollIndicator={true} showsPagination={false}>
            <ScrollView style={styles.container1}>
                <Text style={{fontSize: 20, fontWeight: 'bold', paddingLeft: 10, paddingTop: 10, paddingBottom: 15}}>Favorieten</Text>
                <Text style={{fontSize: 16, paddingLeft: 10, fontWeight: 'bold'}}>Teams</Text>
                    {favoriteTeams.length === 0 ? 
                    <View>
                        <Text style={{fontSize: 14, padding: 10}}>U heeft nog geen favoriete teams. Swipe naar rechts voor een overzicht van alle clubs.</Text>
                        <Text style={{fontSize: 14, padding: 10}}>Om een team toe te voegen aan favorieten houdt u de naam lang ingedrukt.</Text>    
                    </View>
                    :
                    favoriteTeams.map((item) => ( 
                        <View>  
                            <Favorites 
                                key={item.split('%')[1]}
                                naam={item.split('%')[0]} 
                                onPress={() => navigation.navigate('Teaminfo', { guid: item.split('%')[1], naam: item.split('%')[0] })}
                                remove={() => removeFromStorage(item, 'favTeams')}
                                />    
                        </View>
                        )
                    )}

                <Text style={{fontSize: 16, paddingLeft: 10, fontWeight: 'bold', paddingTop: 30}}>Clubs</Text>
                {favoriteClubs.length === 0 ? 
                <View>
                    <Text style={{fontSize: 14, padding: 10}}>U heeft nog geen favoriete clubs. Swipe naar rechts voor een overzicht van alle clubs.</Text>
                    <Text style={{fontSize: 14, padding: 10}}>Om een club toe te voegen aan favorieten houdt u de naam lang ingedrukt.</Text>    
                </View>
                :
                favoriteClubs.map ((item) => (
                    <View>
                        <Favorites 
                            key={clubguis[item]}
                            naam={item}
                            onPress={() => navigation.navigate('Clubinfo', {guid: clubguis[item], naam: item })}
                            remove={() => removeFromStorage(item, 'favClubs')}
                        />
                    </View>
                ))}
            {/* <View style={{width: '100%', position: 'absolute', bottom: 0, paddingTop: 100}}><Button title="VERWIJDER ALLE FAVORIETEN" onPress={() => clearAsyncStorage()}></Button></View> */}
            </ScrollView>

            <View style={styles.container2}>
                <TextInput 
                    style={styles.input}
                    value={search}
                    placeholder="Zoek een club"
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => searchFilter(text)}
                />
                <FlatList data={filteredClubs} renderItem={({item, index}) => 
            
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Clubinfo', { guid: clubguis[item], naam: item })}
                    onLongPress={() => setStorageClubs(item)}
                    key={index}>
                        <Text 
                            key={index} 
                            style={styles.club}>{item}
                        </Text>
                </TouchableOpacity>} />
            </View>
        </Swiper>
    )
}


const styles = StyleSheet.create({
    container1: {
        flex:1,
        backgroundColor: '#fff',
        height: '100%', 
    },
    container2: {
        flex:1,
        backgroundColor: '#fff',
        height: '80%', 
    },
    club: {
        fontSize: 16,
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    input: {
        height: 60,
        borderColor: 'black',
        borderWidth: 1,
        margin: 10,
        padding: 10,
        borderRadius: 5,
        fontSize: 20,
    }
})

export default HomeScreen
