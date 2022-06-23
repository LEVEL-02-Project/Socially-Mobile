import React, { useState, useEffect } from 'react'
import { View, StyleSheet, SafeAreaView, FlatList,RefreshControl } from 'react-native'
import { filter } from 'lodash'
import { Searchbar, IconButton, Menu, Divider } from 'react-native-paper'
import { theme } from './../core/theme'
import AppCard from '../components/AppCard'
import { onShare } from '../services/ShareService'
import { API } from '../navigation/host'
import * as SecureStore from 'expo-secure-store'

export default function ViewAdsScreen({ navigation }) {
  var axios = require('axios')
  const [data, setData] = useState()
  const [refreshing, setRefreshing] = React.useState(false);

   const onShareAd = async(creativeId) =>{

    let userToken,userId;
      try{
        userToken = await SecureStore.getItemAsync('userToken')
        userId = await SecureStore.getItemAsync('userId')
      }catch(e){
        console.log(e)
      }

    // var axios = require('axios')
    // var data = JSON.stringify({
    //   "creativeId": "1"
    // });
    const url = (`${API.host}share?creative_id=${encodeURIComponent(creativeId)}&user_id=${encodeURIComponent(userId)}`)
    // var config = {
    //   method: 'get',
    //   url,
    //   headers: { 
    //     'Authorization': `Bearer ${userToken}`
    //   },
    //   data: data,
    // }

    // axios(config)
    // .then(function (response) {
    //   console.log(JSON.stringify(response.data));
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
    // console.log(creativeId)

    onShare('My App', 'Hello check this amazing discount!', url)
  }

  useEffect(() => {
  var config = {
    method: 'get',
    url:(API.host+'creative'),
    headers: {},
  }
    axios(config)
      .then(function (response) {
        setData(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [refreshing]) 

  const onChangeSearch = (searchQuery) => {
    if (searchQuery) {
      const formatedData = searchQuery.toLowerCase()
      const filterData = filter(data, (creative) => {
        return contains(creative, formatedData)
      })
      setData(filterData)
    } else {
      setData(data)
    }
  }

  const contains = ({ creativeHeading, creativeDescription }, searchQuery) => {
    if (
      creativeHeading.toLowerCase().includes(searchQuery) ||
      creativeDescription.toLowerCase().includes(searchQuery)
    ) {
      return true
    } 
    return false
  }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={{ padding: 5, backgroundColor: theme.colors.white }}>
      <View style={styles.searchBarContainer}>
        <Searchbar
          placeholder="Search"
          onChangeText={(searchQuery) => onChangeSearch(searchQuery)}
          autoCapitalize="none"
          style={styles.searchBar}
        />
        {/* <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              icon="tune-vertical"
              color={theme.colors.medium}
              size={35}
              style={styles.filterIcon}
              onPress={openMenu}
            />
          }
        >
          <Menu.Item onPress={() => {}} title="Best Match" />
          <Divider />
          <Menu.Item onPress={() => {}} title="Ending soonest" />
          <Divider />
          <Menu.Item onPress={() => {}} title="Newly listed" />
        </Menu> */}
      </View>
      <FlatList
        data={data}
        keyExtractor={(data) => data.creativeId.toString()}
        contentContainerStyle={{ paddingBottom: 60 }}
        style={{
          shadowColor: theme.colors.medium,
          shadowOpacity: 0.7,
          shadowOffset: { height: 5, width: 0 },
        }}
        renderItem={({ item }) => (
          <AppCard
            image={item.image}
            title={item.creativeHeading}
            description={item.creativeDescription}
            paymentInformation={'$ ' + item.costPerSale + ' / Per Conversion'}
            onPress = {() => {onShareAd(item.creativeId)}}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  searchBar: {
    flex: 1,
    marginVertical: 10,
    height: 45,
    fontSize: 18,
  },
  filterIcon: {
    borderWidth: 2,
    borderRadius: 2,
    height: 47,
    width: 47,
    marginVertical: 10,
    borderColor: theme.colors.border,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    marginLeft: 5,
    marginRight: 0,
    elevation: 5,
  },
})
