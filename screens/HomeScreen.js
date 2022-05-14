import React, { useState, useEffect }  from 'react'
import { StyleSheet, Text, View, RefreshControl, FlatList, TouchableOpacity, ScrollView, TextInput, Linking, Alert } from 'react-native';
import { Entypo, MaterialCommunityIcons as MCI, FontAwesome5, Fontisto } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage'
import clubguis from '../data/ClubGui.json'
import Favorites from '../components/Favorites';
import Swiper from 'react-native-swiper';
import { sortFunction, isDateInPast } from '../functions'
import ScheduleGame from '../components/ScheduleGame';


function HomeScreen({ navigation }) {

    const [clubs, setClubs] = useState(Object.keys(clubguis))
    const [filteredClubs, setFilteredClubs] = useState(Object.keys(clubguis))
    const [search, setSearch] = useState('');
    const [favoriteTeams, setFavoriteTeams] = useState([]);
    const [favoriteClubs, setFavoriteClubs] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [favoriteTeamsGames, setFavoriteTeamsGames] = useState([]);
    const [favoriteTeamsSchedule, setFavoriteTeamsSchedule] = useState([]);

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
            setFavoriteTeams(JSON.parse(teams))
        }
    }

    const getStorageClubs = async () => {
        const clubs = await AsyncStorage.getItem('favClubs')
        if (clubs !== null) {
            setFavoriteClubs(JSON.parse(clubs))
        }
    }

    const setStorageClubs = async (club) => {
        let clubs = [];
        // check if club is already in storage
        if (!favoriteClubs.includes(club)) {
            try {
                let storedClubs = await AsyncStorage.getItem('favClubs');
                if (storedClubs !== null) {
                  clubs = JSON.parse(storedClubs); 
                }
              clubs.push(club)
              await AsyncStorage.setItem('favClubs', JSON.stringify(clubs));
              Alert.alert('Club toegevoegd aan favorieten!')
              } catch (error) {
              }
        }
    };

    // refresh calls getStorageTeams and getStorageClubs
    const onRefresh = () => {
        getStorageTeams()
        getStorageClubs()
        setRefreshing(false);
    }

    const removeFromStorage = async (name, storage) => {
        let clubs = [];
        try {
          let storedClubs = await AsyncStorage.getItem(storage);
          if (storedClubs !== null) {
            clubs = JSON.parse(storedClubs); 
          }
        clubs = clubs.filter(club => club !== name)
        await AsyncStorage.setItem(storage, JSON.stringify(clubs));
        setFavoriteClubs(prevState => prevState.filter(club => club !== name))
        setFavoriteTeams(prevState => prevState.filter(team => team !== name))
        
        } catch (error) {
        }
    }

    // fetch games for all teams in favorites using http://vblcb.wisseq.eu/VBLCB_WebService/data/OrgDetailByGuid?issguid=
    // const fetchGames = async () => {
    //     const games = []
    //     const schedule = []
    //     setLoading(true)
    //     for (let i = 0; i < favoriteTeams.length; i++) {
    //         let guid = favoriteTeams[i].split('%')[1]
    //         fetch('http://vblcb.wisseq.eu/VBLCB_WebService/data/TeamMatchesByGuid?teamguid='+guid)
    //             .then(response => response.json())
    //             .then(data => {
    //                 for (let i = 0; i < data.length; i++) {
    //                     data[i].uitslag && !data[i].uitslag.includes('FOR') ? games.push(data[i]) : !isDateInPast(new Date(data[i].datumString.split('-').reverse().join('-'))) && schedule.push(data[i])
    //                 }
    //                 for (let i = 0; i < schedule.length; i++) {
    //                     isDateInPast(new Date(schedule[i].datumString.split('-').reverse().join('-'))) && schedule.splice(i, 1)
    //                 }
    //                 setFavoriteTeamsGames(games.sort(sortFunction).reverse());
    //                 setFavoriteTeamsSchedule(schedule.sort(sortFunction));
    //             })
    //     }
    //     setLoading(false)
    // }


    useEffect(() => {
        getStorageTeams()
        getStorageClubs()
        // fetchGames()
    }, [])

    return (

        <Swiper loop={false} showsHorizontalScrollIndicator={true} showsPagination={false}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} style={styles.container1}>
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
            
            <ScrollView style={styles.container2}>
                <Text style={{fontSize: 20, fontWeight: 'bold', paddingLeft: 10, paddingTop: 10, paddingBottom: 15}}><Entypo name="info-with-circle" size={20} color="black" /> Help</Text>
                <Text style={{fontSize: 16, paddingLeft: 10, fontWeight: 'bold'}}>Hoe kan ik een club/team toevoegen aan mijn favorieten?</Text>
                <Text style={{fontSize: 14, padding: 10}}>Om een club/team toe te voegen aan favorieten houdt u de naam lang ingedrukt. Een refresh is nodig om ze zichtbaar te maken.</Text>
                <Text></Text>
                <Text style={{fontSize: 16, paddingLeft: 10, fontWeight: 'bold'}}>Hoe kan ik een club/team verwijderen uit mijn favorieten?</Text>
                <Text style={{fontSize: 14, padding: 10}}>Om een club/team te verwijderen uit favorieten houdt u de naam in de favorietenlijst lang ingedrukt.</Text>
                <Text></Text>
                <Text style={{fontSize: 9, padding: 10, textAlign: 'center'}}>Made by <Text style={{color: 'blue'}}>Jaan Lavaerts</Text> using 
                <Text style={{color: 'blue'}} onPress={() => Linking.openURL('https://www.basketbal.vlaanderen/faq/categorie/api')}> basketbal vlaanderen</Text> </Text>

                
            </ScrollView>
            {/* <ScrollView style={styles.slide3}>
            <View style={styles.header}>
                    <Text style={{color: '#0076ff', fontSize: 20, fontWeight: 'bold'}}>WTF IS DIT</Text>
                    <Text style={{fontSize: 16, paddingBottom: 10, fontWeight: '400'}}>{!teamDetails.poules ? null : teamDetails.poules[0].naam}</Text>
                </View>
                <Text style={{fontSize: 18, paddingBottom: 10, paddingTop: 20}}>Kalender Favoriete Teams</Text>
                {loading ? <ActivityIndicator style={{marginTop:100}} size="large" color="#0076ff" /> : favoriteTeamsSchedule.map((game) => (
                        <ScheduleGame 
                        guid={game.guid}
                        key={game.guid}
                        home={game.tTNaam}
                        away={game.tUNaam}
                        datum={game.datumString}
                        tijd={game.beginTijd.replace('.', ':')}
                        plaats={game.accNaam}
                        poule={game.pouleNaam}
                    />
                ))}
            </ScrollView> */}
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
