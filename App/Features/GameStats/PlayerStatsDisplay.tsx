import React, { useState } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as GlobalConstants from "../../Global/GlobalConstants"
import { PlayerData } from "../../Models/CombinedData";
import { Jerseys, StatImages } from "../../Global/Images";
import { GetFixtureStats, GetPointTotal } from "../../Helpers/FplAPIHelpers";
import { useAppSelector } from "../../Store/hooks";
import { FplOverview } from "../../Models/FplOverview";
import { TeamInfo, TeamTypes } from "../../Store/teamSlice";
import { Identifier } from "../../Models/FplGameweek";
import PlayerCard from "../PlayerStats/PlayerCard";
import { FplFixture } from "../../Models/FplFixtures";

interface PlayerStatsDisplayProps {
    player: PlayerData;
    overview: FplOverview;
    teamInfo: TeamInfo;
    fixtures: FplFixture[];
}

const StatView = (player:PlayerData, teamInfo: TeamInfo, statIdentifier : Identifier) => {
    let stat : number | undefined;

    if (teamInfo.teamType === TeamTypes.Fixture) {
        stat = GetFixtureStats(player, teamInfo, statIdentifier)
    } else {
        stat = player.gameweekData.stats[statIdentifier];
    }

    if (!stat) {
        return null;
    } else {

        if (statIdentifier === Identifier.Saves) {
            stat = Math.floor(stat / 3);
        }

        return <View style={styles.statsContainer}>
                {[...Array(stat)].map((i, index) =>  <Image style={(statIdentifier === Identifier.YellowCards || statIdentifier === Identifier.RedCards) ? styles.cardImage : styles.statsImage} 
                                                            source={StatImages[statIdentifier]} 
                                                            resizeMode="contain" 
                                                            key={index.toString()}/>)}
                </View> 
    }
}

const FixturesText = (player: PlayerData, fixtures: FplFixture[], overview: FplOverview) => {

    var currentGameweek = overview.events.filter((event) => { return event.is_current === true; })[0].id;
    var playerFixtures = fixtures.filter(fixture => (fixture.event === currentGameweek) && ((fixture.team_a === player.overviewData.team) || (fixture.team_h === player.overviewData.team)))

    return (
        <Text numberOfLines={1} style={[styles.text, {fontWeight: '400', fontSize: GlobalConstants.smallFont}]}>
            { playerFixtures.map(fixture => (fixture.team_a === player.overviewData.team) ? (overview.teams.find(team => team.id === fixture.team_h)?.short_name) + '(A)'
                                                                                          : (overview.teams.find(team => team.id === fixture.team_a)?.short_name) + '(H)')
                            .join(', ')}
        </Text>

    //   <Text numberOfLines={1} style={[styles.text, {fontSize: GlobalConstants.smallFont*0.9}]}>MAN(A), MCI(H)</Text>
    )

}

const PlayerStatsDisplay = (prop: PlayerStatsDisplayProps) => {

    const [isPlayerCardModalVisible, setIsPlayerCardModalVisible] = useState(false);

    return (
        <>
        <PlayerCard player={prop.player}  teamInfo={prop.teamInfo} overview={prop.overview} fixtures={prop.fixtures} isVisible={isPlayerCardModalVisible} isVisibleFunction={setIsPlayerCardModalVisible}/>

        <TouchableOpacity style={styles.container} onPress={() => setIsPlayerCardModalVisible(!isPlayerCardModalVisible)}>
            { (prop.teamInfo.teamType !== TeamTypes.Empty) &&
            <>
            
            <View style={{flex:3, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                <Image style={{alignSelf: 'center', height: (prop.teamInfo.teamType === TeamTypes.Budget || prop.teamInfo.teamType === TeamTypes.Draft) ? '85%' : '75%'}} source={Jerseys[prop.player.overviewData.team_code]} resizeMode="contain"/>

                <View style={{alignItems: 'flex-start', justifyContent: 'flex-start', width: '90%', height: '90%', position: 'absolute'}}>
                    { StatView(prop.player, prop.teamInfo, Identifier.GoalsScored) }
                    { StatView(prop.player, prop.teamInfo, Identifier.Assists) }
                    { StatView(prop.player, prop.teamInfo, Identifier.Saves) }
                    { StatView(prop.player, prop.teamInfo, Identifier.OwnGoals) }
                    <View style={styles.cardsContainer}>
                        { StatView(prop.player, prop.teamInfo, Identifier.YellowCards) }
                        { StatView(prop.player, prop.teamInfo, Identifier.RedCards) }
                    </View> 
                </View> 
            </View>

            <View style={{flex: (prop.teamInfo.teamType === TeamTypes.Budget || prop.teamInfo.teamType === TeamTypes.Draft) ? 1.5 : 0.75, 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          paddingBottom: 1, 
                          width: (prop.teamInfo.teamType === TeamTypes.Budget || prop.teamInfo.teamType === TeamTypes.Draft) ? '130%' : '95%'}}>
                <View style={{flex: 1, flexDirection: 'row', backgroundColor: GlobalConstants.primaryColor}}>
                    <Text numberOfLines={1} style={[styles.text, {fontSize: GlobalConstants.smallFont * 1.1, fontWeight: '500', paddingLeft: 5, paddingRight: 5}]}>{prop.player.overviewData.web_name}</Text>
                </View>
                {(prop.teamInfo.teamType === TeamTypes.Budget || prop.teamInfo.teamType === TeamTypes.Draft) && 
                    <View style={{flex: 1, flexDirection: 'row', backgroundColor: GlobalConstants.secondaryColor, paddingLeft: 5, paddingRight: 5, marginTop: -0.1 }}>
                        { FixturesText(prop.player, prop.fixtures, prop.overview)}
                    </View>
                }
            </View>
            </>
            }
        </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            height: '100%',
            width: GlobalConstants.width*(1/6),
            justifyContent: 'center',
            alignItems: 'center',
        },

        text: {
            flex: 1, 
            fontSize: GlobalConstants.smallFont, 
            alignSelf: 'center', 
            textAlign:'center',
            color: GlobalConstants.textPrimaryColor,
        },

        //#region Stats
        statsContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            marginLeft: 0,
        },

        cardsContainer: {
            flexDirection: 'row',
            position: "absolute",
            right: 10,
            top: -1,

        },

        statsImage: {
            height: GlobalConstants.width/26,
            width: GlobalConstants.width/26,
            marginRight: -8,
        },

        cardImage: {
            height: GlobalConstants.width/20,
            width: GlobalConstants.width/20,
            marginRight: -13,
            marginTop: -1,
            transform: [{ rotate: "337deg" }]
        },
        //#endregion

        //#region Score
        scoreText: {
            fontSize: GlobalConstants.width*0.03,
            position: "absolute",
            overflow: 'hidden',
        },

        scoreContainer: {
            height: GlobalConstants.width/24,
            width: GlobalConstants.width/24,
            borderRadius: GlobalConstants.width/24/2,
            backgroundColor: GlobalConstants.tertiaryColor,
            color: GlobalConstants.textSecondaryColor,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            right: 7,
            bottom: 0

        },
        //#endregion
    }
);

export default PlayerStatsDisplay;