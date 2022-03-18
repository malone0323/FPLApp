// This will contain understat and fpl data combined in a nice playercard that will help
// ppl see how a player is performing recently as well as on the overall season

import React from "react";
import { Modal, Pressable, View, Image, StyleSheet, Text, ScrollView } from "react-native";
import { StatNames } from "../../Global/EnumsAndDicts";
import globalStyles from "../../Global/GlobalStyles";
import { Emblems, Icons } from "../../Global/Images";
import { PlayerData } from "../../Models/CombinedData";
import { FplFixture } from "../../Models/FplFixtures";
import { FplOverview } from "../../Models/FplOverview";
import { TeamInfo, TeamTypes } from "../../Store/teamSlice";
import * as GlobalConstants from "../../Global/GlobalConstants";
import { GetTeamDataFromOverviewWithFixtureTeamID } from "../../Helpers/FplAPIHelpers";
import CloseButton from "../Controls/CloseButton";

interface PlayerCardProps {
    player: PlayerData;
    teamInfo: TeamInfo;
    overview: FplOverview;
    isVisible: boolean;
    isVisibleFunction : (value: React.SetStateAction<boolean>) => void;
    fixtures: FplFixture[];
}

function AllFixturesPlayerStatsView(playerData: PlayerData, teamInfo: TeamInfo, overview: FplOverview, fixtures: FplFixture[]) {

    if (teamInfo.teamType === TeamTypes.Fixture) {

        if (teamInfo.fixture) {
            return FixturePlayerStatsView(playerData, overview, teamInfo.fixture);
        }
    }
    else if (teamInfo.teamType !== TeamTypes.Empty) {

        let game: FplFixture | undefined;

        return playerData.gameweekData.explain.map(fixture => 
            {
                game = fixtures.find(game => game.id === fixture.fixture)
                if (game) return FixturePlayerStatsView(playerData, overview, game)
            })        
    }

    return null;
}

function FixturePlayerStatsView(playerData: PlayerData, overview: FplOverview, fixture: FplFixture) {
    return (
        <View key={fixture.id} style={{ alignItems: 'center', marginTop: 15, marginBottom: 5}}>
            <View style={styles.fixtureScoreView}>
                <View style={styles.emblemView}>
                    <Image style={styles.emblems} source={Emblems[GetTeamDataFromOverviewWithFixtureTeamID(fixture.team_h, overview).code]} resizeMode='contain' />
                </View>
                <Text style={[styles.scoreText, {alignSelf: 'center'}]}>{fixture.team_h_score}  -  {fixture.team_a_score}</Text>
                <View style={styles.emblemView}>
                    <Image style={styles.emblems} source={Emblems[GetTeamDataFromOverviewWithFixtureTeamID(fixture.team_a, overview).code]} resizeMode='contain' />
                </View>
                
            </View>

            <View style={{flexDirection: 'row', borderColor: 'lightgray', borderBottomWidth: 1, padding: 5}}>
                <Text style={[styles.statText, {flex: 3}]}>Stat</Text>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={styles.statText}>Value</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={styles.statText}>Points</Text>
                </View>
            </View>
            {
                playerData.gameweekData.explain.find(game => game.fixture === fixture.id)?.stats.map(stat => 
                        <View key={stat.identifier} style={{flexDirection: 'row', padding: 5}}>
                            <Text style={[styles.statText, {flex: 3}]}>{StatNames[stat.identifier]}</Text>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Text style={styles.statText}>{stat.value}</Text>
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Text style={styles.statText}>{stat.points}</Text>
                            </View>
                        </View>
                    )
            }
        </View>
    )
}

const PlayerCard = (props: PlayerCardProps) => {

    return (
        <Modal animationType="fade" transparent={true} visible={props.isVisible}>
            <Pressable style={globalStyles.modalBackground} onPressIn={() => props.isVisibleFunction(false)}/>

            <View style={[globalStyles.modalView, globalStyles.modalShadow, { maxHeight: GlobalConstants.height * 0.5 }]}>
                <CloseButton boolFunction={props.isVisibleFunction}/>
                <Text style={{fontSize: GlobalConstants.largeFont, color: GlobalConstants.textPrimaryColor, alignSelf: 'center', paddingTop: 10, fontWeight: '500', textAlign: 'center'}}>
                    {props.player.overviewData.first_name + " " + props.player.overviewData.second_name}
                </Text>
                <ScrollView style={{ flex: 1 }}>
                    { AllFixturesPlayerStatsView(props.player, props.teamInfo, props.overview, props.fixtures) }      
                </ScrollView>
                         
            </View>            
        </Modal>
    )
}

const styles = StyleSheet.create(
    {
        statText: {
            color: GlobalConstants.modalTextColor,
            fontSize: GlobalConstants.mediumFont,
        },

        fixtureScoreView: {
            flexDirection: 'row', 
            width: '75%', 
            alignSelf: 'center', 
            height: GlobalConstants.height*0.05, 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: 10,
        },

        scoreText: {
            color: GlobalConstants.modalTextColor,
            fontSize: GlobalConstants.largeFont,
            marginLeft: 5,
            marginRight: 5,
        },

        emblemView: {
            width:'25%',
        },

        emblems: {
            resizeMode: 'contain',
            alignSelf:'center',
            height: '100%',
            width: '100%',
         },

    }
)

export default PlayerCard;