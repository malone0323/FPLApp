import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import globalStyles from "../../../../Global/GlobalStyles";
import * as GlobalConstants from "../../../../Global/GlobalConstants";
import CustomSlider from "../../../Controls/Slider";
import { PlayerTableFilterAction, PlayerTableFilterState } from "../PlayerTableFilterReducer";
import { AnimatedButton } from "../../../Controls";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "../../../../../App";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import { useAppSelector } from "../../../../Store/hooks";

interface TableFilterPopupProps {
    filterDispatch: (value: PlayerTableFilterAction) => void;
    filterState: PlayerTableFilterState;
    initialPriceRange: number[];
}

const TableFilterPopup = ({ filterDispatch, filterState, initialPriceRange } : TableFilterPopupProps) => {

    const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

    const liveGameweek = useAppSelector(state => state.team.liveGameweek);
    const [isPer90, setIsPer90] = useState(filterState.isPer90);
    const [isInWatchlist, setIsInWatchlist] = useState(filterState.isInWatchlist);
    const [priceRange, setPriceRange] = useState(filterState.priceRange);
    const [minuteRange, setMinuteRange] = useState(filterState.minutesRange);

    const clearFunction = () => {
        setIsPer90(false);
        setIsInWatchlist(false);
        setPriceRange(initialPriceRange);
        setMinuteRange([0, 90*liveGameweek]);

        filterDispatch({type: 'Reset', priceRange: initialPriceRange, minutesRange: [0, 90*liveGameweek]});
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <View style={styles.checkboxContainer}>
                <Text style={styles.filterText}>Per 90 (if applicable):</Text>
                <Checkbox value={ isPer90 } hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
                        color={isPer90 ? GlobalConstants.fieldColor : GlobalConstants.lightColor}
                        onValueChange={ () => setIsPer90(!isPer90)}/>
            </View>
            <View style={styles.checkboxContainer}>
                <Text style={styles.filterText}>On Watchlist:</Text>
                <Checkbox value={ isInWatchlist } hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
                        color={isInWatchlist ? GlobalConstants.fieldColor : GlobalConstants.lightColor}
                        onValueChange={ () => setIsInWatchlist(!isInWatchlist)}/>
            </View>
            <View style={styles.sliderContainer}>
                <CustomSlider header={"Price Range:"} minValue={initialPriceRange[0]} maxValue={initialPriceRange[1]} 
                                step={1} isPrice={true} initialRange={priceRange} debounceValue={400}
                                onValueChange={value => setPriceRange(value)}/>
            </View>
            <View style={styles.sliderContainer}>
                <CustomSlider header={"Minutes Per Game Range:"} minValue={0} maxValue={90 * liveGameweek} 
                                step={1} initialRange={minuteRange} debounceValue={400}
                                onValueChange={ value => setMinuteRange(value) }/>
            </View>
            <View style={styles.buttonsContainer}>
                <View style={styles.buttonContainer}>
                    <AnimatedButton buttonFn={() => filterDispatch({type: 'FilterPopupChange', minuteRange: minuteRange, priceRange: priceRange, 
                                                                                               isInWatchlistValue: isInWatchlist, per90Value: isPer90})}>
                        <View style={[globalStyles.baseButton, styles.buttonInnerContainer]}>
                            <Text style={styles.buttonFont}>Apply</Text>
                        </View>
                    </AnimatedButton>
                </View>
                <View style={styles.buttonContainer}>
                    <AnimatedButton buttonFn={clearFunction}>
                        <View style={[globalStyles.baseButton, styles.buttonInnerContainer, {backgroundColor: GlobalConstants.redColor}]}>
                            <Text style={styles.buttonFont}>Clear</Text>
                        </View>
                    </AnimatedButton>
                </View>
            </View>
        </View>
    )
}

export default TableFilterPopup;

const styles = StyleSheet.create({

    container: {
        padding: moderateScale(5, 0.2),
        width: '100%',
    },

    filterText: {
        color: GlobalConstants.textPrimaryColor,
        fontSize: GlobalConstants.mediumFont,
        flex: 1,
        fontWeight: '500'
    },

    checkboxContainer: {
        flex: 1, 
        flexDirection: 'row',
        paddingBottom: moderateVerticalScale(10),
    },

    sliderContainer: {
        flex: 2, 
        paddingBottom: moderateVerticalScale(10),
    },
    
    buttonsContainer: {
        flex: 1, 
        width: moderateScale(250),
        alignSelf: 'center',
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
    },

    buttonContainer: {
        flex: 1, 
        alignContent: 'center', 
        justifyContent: 'center',
    },

    buttonInnerContainer: {
        width: moderateScale(100, 0.4),
        alignSelf: 'center',
        padding: moderateScale(10, 0.2)
    },

    buttonFont: {
        fontSize: GlobalConstants.mediumFont,
        fontWeight: '500',
        color: GlobalConstants.textPrimaryColor,
    }
});