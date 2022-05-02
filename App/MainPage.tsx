import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Platform, StatusBar, Image, ActivityIndicator } from 'react-native';
import FixturesView from './Features/Fixtures/Fixtures';
import * as GlobalConstants from './Global/GlobalConstants'
import { useGetFixturesQuery, useGetOverviewQuery } from './Store/fplSlice';
import { useAppSelector } from "./Store/hooks";
import { ScreenTypes } from "./Store/navigationSlice";
import ModalNavigator from "./Modals/ModalNavigator";
import { LineupViewQueriesContainer } from "./Features/LineupView";
import PlayerStats from "./Features/PlayerStats";
import FixturesContainer from "./Features/Fixtures/FixturesContainer";
import BottomTabs from "./Features/BottomTabs";
import { LoadingIndicator } from "./Features/Controls";

const MainPage = () => {

  const overview = useGetOverviewQuery();
  const fixtures = useGetFixturesQuery();
  const navigation = useAppSelector(state => state.navigation);

  const [isSplashScreenVisible, setIsSplashScreenVisible] = useState(true);

  useEffect( function refetchFixtures() {
    if (fixtures.isError) {
      setTimeout(() => { fixtures.refetch() }, 30000);
    }
  }, [fixtures.isError]);

  useEffect( function refetchOverview() {
    if (overview.isError) {
      setTimeout(() => { overview.refetch() }, 30000);
    }
  }, [overview.isError]);

  useEffect( function removeSplashScreen() {

    const setSplashScreenVisibleToFalse = () => setTimeout(() => setIsSplashScreenVisible(false), 3000);

    if (fixtures.isSuccess && overview.isSuccess) {
      setSplashScreenVisibleToFalse();
    }

  }, [fixtures.isSuccess, overview.isSuccess]);

  return (
    <View style={{flex: 1, backgroundColor: GlobalConstants.primaryColor}}>
      { isSplashScreenVisible && 
        <View style={styles.splashScreenContainer}>
          <Image style={styles.splashScreenImage} source={require('../assets/splashscreen.png')}/>
          <View style={{height: '11%', aspectRatio: 1, alignSelf: 'center'}}>
            <LoadingIndicator/>
          </View>
        </View> 
      }
        <>
          <SafeAreaView style={styles.safeArea}>
              {(overview.data && fixtures.data) &&
                <View style={{flex: 1}}>
                  <View style={{height: '17.5%', width: '100%'}}/>
                  <FixturesContainer overview={overview.data} fixtures={fixtures.data}/>
                  <View style={styles.lineupView}>
                    <LineupViewQueriesContainer overview={overview.data} fixtures={fixtures.data}/>
                  </View>
                  <PlayerStats overview={overview.data} fixtures={fixtures.data}/>
                  <View style={{width: '100%', height: 50}}>
                    <BottomTabs/>
                  </View>
                </View>
              }

              {(fixtures.isError || overview.isError) && 
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30}}> 
                  <Text style={{ alignSelf: 'center', textAlign: 'center', color: GlobalConstants.textPrimaryColor, fontSize: GlobalConstants.largeFont, fontWeight: '600' }}> 
                    Please reopen the app once the gameweek has been processed by the FPL API. 
                  </Text>
                </View>
              }
          </SafeAreaView>

          {(overview.data && fixtures.data) &&
            <ModalNavigator overview={overview.data} fixtures={fixtures.data}/>
          }
        </>
    </View>
  )
}

const styles = StyleSheet.create({
  
  safeArea: {
    backgroundColor: GlobalConstants.primaryColor,
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  lineupView: {
    flex: 1,
  },
  
  splashScreenContainer: {
    height: '100%', 
    width: '100%', 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'absolute', 
    zIndex: 1, 
    elevation: 1,  
    backgroundColor: GlobalConstants.primaryColor
  },

  splashScreenImage: {
    position: 'absolute', 
    height: '93%',
    width: '100%', 
    top: '5%'
  },

  loadingText: {
    fontSize: GlobalConstants.largeFont * 1.2,
    color: GlobalConstants.lightColor,
    fontWeight: '500',
  }
  
});

export default MainPage;
