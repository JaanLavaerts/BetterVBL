import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator, Alert, Button, Modal } from 'react-native';
import { Entypo, MaterialCommunityIcons as MCI, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import Swiper from 'react-native-swiper'
import { sortFunction, isDateInPast } from '../functions'
import Game from '../components/Game';
import ScheduleGame from '../components/ScheduleGame';

const Teaminfo = ({navigation, route}) => {


    const [teamDetails, setTeamDetails] = useState({});
    const [teamGames, setTeamGames] = useState([]);
    const [teamSchedule, setTeamSchedule] = useState([]);
    const [loading, setLoading] = useState(true)

    const fetchTeamGames = () => {
        const games = []
        const schedule = []
        setLoading(true);
        fetch('http://vblcb.wisseq.eu/VBLCB_WebService/data/TeamMatchesByGuid?teamguid='+route.params.guid)
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    data[i].uitslag && !data[i].uitslag.includes('FOR') ? games.push(data[i]) : !isDateInPast(new Date(data[i].datumString.split('-').reverse().join('-'))) && schedule.push(data[i])
                }
                for (let i = 0; i < schedule.length; i++) {
                    isDateInPast(new Date(schedule[i].datumString.split('-').reverse().join('-'))) && schedule.splice(i, 1)
                }
                setTeamGames(games.sort(sortFunction).reverse());
                setTeamSchedule(schedule.sort(sortFunction));
                setLoading(false);
            })
    }

    const fetchTeamDetails = () => { 
        setLoading(true);
        fetch('http://vblcb.wisseq.eu/VBLCB_WebService/data/TeamDetailByGuid?teamguid='+route.params.guid)
            .then(response => response.json())
            .then(data => {
                setTeamDetails(data[0]);
                setLoading(false);
            })     
    }


    useEffect(() => {
        fetchTeamDetails();
        fetchTeamGames();
    }, [route.params.guid]);
    
    return (
        
        <Swiper loop={false} showsHorizontalScrollIndicator={true} showsPagination={false} style={styles.wrapper}>
            <ScrollView style={styles.slide1}>
            <View style={styles.header}>
                    <Text style={{color: '#0076ff', fontSize: 20, fontWeight: 'bold'}}>{route.params.naam}</Text>
                    <Text style={{fontSize: 16, paddingBottom: 10, fontWeight: '400'}}>{!teamDetails.poules ? null : teamDetails.poules[0].naam}</Text>
                </View>
                
                <Text style={{fontSize: 18, paddingBottom: 10, paddingTop: 20}}>Klassement</Text>
                {!teamDetails.poules ? null : <View style={styles.listWrapper}>
                        <Text style={{width: '10%', fontWeight:'bold'}}> #</Text>
                        <Text style={{width: '75%', fontWeight:'bold'}}>Naam</Text>
                        <Text style={{width: '5%', fontWeight:'bold'}}>W</Text>
                        <Text style={{width: '5%', fontWeight:'bold'}}>L</Text>
                        <Text style={{width: '5%', fontWeight:'bold'}}>PT</Text>
                </View>}
                {!teamDetails.poules ? <ActivityIndicator style={{marginTop:100}} size="large" color="#0076ff"/> : teamDetails.poules[0].teams.map(team => (
                    <View key={team.guid} style={styles.listWrapper}>
                        <Text style={styles.rangnr}>{team.rangNr}</Text>
                        <Text 
                            onPress={() => navigation.navigate('Teaminfo', { guid: team.guid, naam: team.naam })}
                            style={[team.naam === route.params.naam ? styles.naamIsTeam : styles.naamIsNotTeam]}>{team.naam}</Text>
                        <Text style={styles.w}>{team.wedWinst}</Text>
                        <Text style={styles.l}>{team.wedVerloren}</Text>
                        <Text style={styles.pts}>{team.wedPunt}</Text>
                    </View>
                ))}
            </ScrollView>

            <ScrollView style={styles.slide2}>
            <View style={styles.header}>
                    <Text style={{color: '#0076ff', fontSize: 20, fontWeight: 'bold'}}>{route.params.naam}</Text>
                    <Text style={{fontSize: 16, paddingBottom: 10, fontWeight: '400'}}>{!teamDetails.poules ? null : teamDetails.poules[0].naam}</Text>
                </View>
                <Text style={{fontSize: 18, paddingBottom: 10, paddingTop: 20}}>Uitslagen</Text>
                {loading ? <ActivityIndicator style={{marginTop:100}} size="large" color="#0076ff" /> : teamGames.map((game) => (
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
            <View style={styles.header}>
                    <Text style={{color: '#0076ff', fontSize: 20, fontWeight: 'bold'}}>{route.params.naam}</Text>
                    <Text style={{fontSize: 16, paddingBottom: 10, fontWeight: '400'}}>{!teamDetails.poules ? null : teamDetails.poules[0].naam}</Text>
                </View>
                <Text style={{fontSize: 18, paddingBottom: 10, paddingTop: 20}}>Kalender</Text>
                {loading ? <ActivityIndicator style={{marginTop:100}} size="large" color="#0076ff" /> : teamSchedule.map((game) => (
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

            <ScrollView style={styles.slide4}>
            <View style={styles.header}>
                    <Text style={{color: '#0076ff', fontSize: 20, fontWeight: 'bold'}}>{route.params.naam}</Text>
                    <Text style={{fontSize: 16, paddingBottom: 10, fontWeight: '400'}}>{!teamDetails.poules ? null : teamDetails.poules[0].naam}</Text>
                </View>
                <Text style={{fontSize: 18, paddingBottom: 10, paddingTop: 20}}>Spelers</Text>
                <Text style={{marginBottom: 20, fontStyle: 'italic'}}>Pas op! Spelerslijsten kunnen inaccuraat zijn.</Text>
                {!teamDetails.spelers ? <ActivityIndicator style={{marginTop:100}} size="large" color="#0076ff" /> : teamDetails.spelers.map(player => (
                    <View key={player.lidNr} style={{flexDirection:'row'}}>
                    <Text style={{flex: 1, paddingVertical: 5, borderBottomWidth: 0.7, borderColor: '#ccc'}}><Ionicons name="person-sharp" size={14} color="black" /> {player.naam}</Text>
                    <Text style={{paddingVertical: 5, borderBottomWidth: 0.7, borderColor: '#ccc'}}>{player.sGebDat}</Text>
                    </View>
                ))}
                {!teamDetails.spelers ? <ActivityIndicator style={{marginTop:100}} size="large" color="#0076ff" /> : teamDetails.tvlijst.map(coach => (
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1, paddingVertical: 5, borderBottomWidth: 0.7, borderColor: '#ccc'}}><MaterialCommunityIcons name="whistle" size={14} color="black" /> {coach.naam}</Text>
                        <Text style={{paddingVertical: 5, borderBottomWidth: 0.7, borderColor: '#ccc'}}>{coach.tvCaC}</Text>
                    </View>
                ))}
            </ScrollView>
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
        padding: 15,
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

    listWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomWidth: 0.7,
        borderColor: '#ccc',
    },
    rangnr: {
        width: '10%',
        paddingVertical: 7,
    },
    naamIsTeam: {
        width: '75%',
        paddingVertical: 7,
        color: '#0076ff',
        fontWeight: 'bold',
    },
    naamIsNotTeam: {
        width: '75%',
        paddingVertical: 7,
        color: '#000',
    },
    w: {
        width: '5%',
        paddingVertical: 7,
    },
    l: {
        width: '5%',
        paddingVertical: 7,
    },
    pts: {
        width: '5%',
        paddingVertical: 7,
    }



})

export default Teaminfo
