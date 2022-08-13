import React from "react";
import { View, Text } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { styles } from "../StandingsStyles";

const StandingsHeader = () => {

    return (
        <View style={styles.headerContainer}>
            <Text style={[styles.leagueHeaderText, {flex: 1}]}>Rank</Text>
            <Text style={[styles.leagueHeaderText, {flex: 3, paddingLeft: moderateScale(5),  textAlign: 'left'}]}>Team & Manager</Text>
            <Text style={[styles.leagueHeaderText, {flex: 1}]}>GW</Text>
            <Text style={[styles.leagueHeaderText, {flex: 1}]}>Total</Text>                                
        </View>
    )
}

export default StandingsHeader;