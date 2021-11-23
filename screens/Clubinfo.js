import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator, Alert} from 'react-native';
import Swiper from 'react-native-swiper'
import { Entypo, MaterialCommunityIcons as MCI, FontAwesome5, Fontisto } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link } from '@react-navigation/native';
import { sortFunction, isDateInPast } from '../functions'
import Game from '../components/Game';
import ScheduleGame from '../components/ScheduleGame';



function Clubinfo({navigation, route}) {

    const [teams, setTeams] = useState([])
    const [clubinfo, setClubInfo] = useState([])
    const [plaatsen, setPlaatsen] = useState([])
    const [bestuur, setBestuur] = useState([])
    const [loading, setLoading] = useState(true)
    const [clubGames, setClubGames] = useState([])
    const [clubSchedule, setClubSchedule] = useState([])
    
    const fetchTeams = () => {
        setLoading(true)
        fetch('http://vblcb.wisseq.eu/VBLCB_WebService/data/OrgDetailByGuid?issguid='+route.params.guid)
            .then(response => response.json())
            .then(data => {
                setTeams(data[0].teams)
                setClubInfo(data[0])
                setPlaatsen(data[0].accomms)
                setBestuur(data[0].bestuur)
            })
            setLoading(false)
    }

    const fetchClubGames = () =>{
        const games = []
        const schedule = []
        setLoading(true)
        fetch('http://vblcb.wisseq.eu/VBLCB_WebService/data/OrgMatchesByGuid?issguid='+route.params.guid)
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    data[i].uitslag && !data[i].uitslag.includes('FOR') ? games.push(data[i]) : !isDateInPast(new Date(data[i].datumString.split('-').reverse().join('-'))) && schedule.push(data[i])
                }
                for (let i = 0; i < schedule.length; i++) {
                    isDateInPast(new Date(schedule[i].datumString.split('-').reverse().join('-'))) && schedule.splice(i, 1)
                }
                setClubGames(games.sort(sortFunction).reverse().slice(0,30));
                setClubSchedule(schedule.sort(sortFunction).slice(0,30));
                setLoading(false)
            })
    }

    const setStorageTeams = async (team) => {
        let teams = [];
        try {
          let storedTeams = await AsyncStorage.getItem('favTeams');
          if (storedTeams !== null) {
            teams = JSON.parse(storedTeams); 
          }
          teams.push(team)
          await AsyncStorage.setItem('favTeams', JSON.stringify(teams));
          Alert.alert('Team toegevoegd aan favorieten. Herstart de app.')
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchTeams()
        fetchClubGames()
    }, [route.params.guid])

    return (
        <Swiper loop={false} showsHorizontalScrollIndicator={true} showsPagination={false} style={styles.wrapper}>
            <View style={styles.slide1}>
                <View style={styles.header}>
                    <Image 
                        source={{uri: `https://vbl.wisseq.eu/vbldataOrganisation/${route.params.guid}_Small.jpg`}}
                        style={{resizeMode: 'contain', width: 100, height: 100}}
                    />
                    <Text style={{fontSize: 20, paddingBottom: 10}}>{route.params.naam}</Text>
                </View>

                <ScrollView style={styles.teams}>
                    {loading ? <ActivityIndicator style={{marginTop:100}} size="large" color="#0076ff" /> : teams.map((team) =>
                    (<TouchableOpacity 
                        onPress={() => navigation.navigate('Teaminfo', { guid: team.guid, naam: team.naam })}
                        onLongPress={() => setStorageTeams(team.naam + "%" + team.guid)}
                        key={team.guid} 
                        style={styles.team}><Text>{team.naam}</Text></TouchableOpacity>) )}
                </ScrollView>
            </View>

            <ScrollView style={styles.slide2}>
                <Text style={{fontSize: 20, paddingBottom: 10, fontWeight: 'bold'}}>Uitslagen</Text>
                {loading ? <ActivityIndicator style={{marginTop:100}} size="large" color="#0076ff" /> : clubGames.map((game) => (
                    <Game 
                        guid={game.guid}
                        key={game.guid}
                        uitslag={game.uitslag}
                        home={game.tTNaam}
                        away={game.tUNaam}
                        datum={game.datumString}
                        tijd={game.beginTijd}
                        plaats={game.accNaam}
                        poule={game.pouleNaam}
                    />

                ))}
            </ScrollView>

            <ScrollView style={styles.slide3}>
                <Text style={{fontSize: 20, paddingBottom: 10, fontWeight: 'bold'}}>Kalender</Text>
                {loading ? <ActivityIndicator style={{marginTop:100}} size="large" color="#0076ff" /> : clubSchedule.map((game) => (
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
            </ScrollView>

            <View style={styles.slide4}>
                <Text style={{fontSize: 20, paddingBottom: 10, fontWeight: 'bold'}}>Algemeen</Text>
                <Text style={{fontSize: 14}}><FontAwesome5 name="hashtag" size={14} color="black" /> {clubinfo.stamNr}</Text>
                <Text style={{fontSize: 14}}><Entypo name="location" size={14} color="black" /> {clubinfo.plaats}</Text>
                <Text  
                    style={{color: 'blue', fontSize: 14}} 
                    onPress={() => Linking.openURL('http://'+clubinfo.website)}>
                    <MCI name="web" size={14} color="black" /> {clubinfo.website}
                </Text>
                <Text style={{fontSize: 14}}><Entypo name="email" size={14} color="black" /> {clubinfo.email}</Text>

                <Text style={{fontSize: 20, paddingBottom: 10, paddingTop: 30, fontWeight: 'bold'}}>Accommodaties</Text>
                {plaatsen.map(plaats => (<Text 
                    onPress={() => Linking.openURL('https://www.google.com/maps/place/'+plaats.adres.straat+' '+plaats.adres.huisNr+' '+plaats.adres.postcode)}
                    style={{fontSize: 14}}><MCI name="home-city" size={14} color="black" /> {plaats.naam} - 
                    <Text>
                    </Text> <Text style={{color: 'blue'}}>{plaats.adres.straat} {plaats.adres.huisNr} {plaats.adres.postcode}</Text></Text> ) )}
                
                
                <Text style={{fontSize: 20, paddingBottom: 10, paddingTop: 30, fontWeight: 'bold'}}>Bestuur</Text>
                {bestuur.map(persoon => (
                <Text style={{ fontSize: 14,}}><Fontisto name="person" size={14} color="black" /> <Text style={{paddingLeft:20}}>{persoon.naam}</Text>
                </Text> ) )}
            </View>




        </Swiper>
    )
}


const styles = StyleSheet.create({
    header: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    slide1: {
        backgroundColor: '#fff',
    },
    team: {
        fontSize: 16,
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    wrapper: {
        backgroundColor: '#fff',
    },
    slide2: {  
        padding: 15,
    },
    slide3: {  
        padding: 15,
    },
    slide4: {  
        padding: 15,
    },

})

export default Clubinfo
