import { StyleSheet } from "react-native";
import { moderateVerticalScale } from "react-native-size-matters";
import { textSecondaryColor, smallFont, textPrimaryColor, mediumFont, secondaryColor, largeFont, primaryColor, lightColor } from "../../Global/GlobalConstants";


export const styles = StyleSheet.create({

    titleText:{
        textAlign: 'center', 
        color: textPrimaryColor, 
        fontWeight: '700', 
        marginBottom: moderateVerticalScale(25), 
        marginTop: moderateVerticalScale(15), 
        fontSize: largeFont
    },

    leagueHeaderText: {
        color: textPrimaryColor,
        fontSize: smallFont * 1.3,
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight: '600'
    },

    leagueText: {
        color: textPrimaryColor,
        fontSize: smallFont * 1.3,
        alignSelf: 'center',
        textAlign: 'center'
    },

    standingsButtonContainer: {
        flex: 1, 
        flexDirection: 'row', 
        paddingTop: moderateVerticalScale(10), 
        paddingBottom: moderateVerticalScale(10)
    },

    teamNameText: {
        textAlign: 'left', 
        flex: 1, 
        color: textPrimaryColor,
        fontSize: smallFont * 1.4, 
        fontWeight: '600'
    },

    managerNameText: {
        textAlign: 'left', 
        flex: 1, 
        color: textSecondaryColor, 
        fontSize: smallFont * 1.1,
    },

    backButtonText:{ 
        color: textSecondaryColor,
        fontSize: mediumFont,
        fontWeight: '700', 
        textAlign: 'center'
    },
    
    headerContainer: {
        flex: 1, 
        flexDirection: 'row', 
        paddingBottom: moderateVerticalScale(7), 
        borderBottomColor: lightColor, 
        borderBottomWidth: 1.5, 
        backgroundColor: primaryColor
    },
});
