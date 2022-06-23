import React, { useState, useEffect } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from './../core/theme'
import AppList from '../components/List'
import { API } from '../navigation/host'
import * as SecureStore from 'expo-secure-store'

const TransactionScreen = ({ navigation }) => {
  const [data, setData] = useState()
  const axios = require('axios')
  useEffect(() => {
    getData();
  }, [])

  const getData = async()=>{
    let userToken = await SecureStore.getItemAsync('userToken')
    console.log(userToken)
    var config = {
      method: 'get',
      url: API.host + 'publisher-transaction/transactionsByPublisherId',
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
    axios(config)
      .then(function (response) {
        setData(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.white }}>
      <View style={{ marginTop: 5, backgroundColor: theme.colors.white }}>
        <FlatList
          data={data}
          keyExtractor={(data) => data.id.toString()}
          style={{
            shadowColor: theme.colors.medium,
            shadowOpacity: 0.8,
            shadowOffset: { height: 5, width: 3 },
          }}
          renderItem={({ item }) => (
            <AppList
              amount={item.amount}
              date={item.date}
              // time={item.time}
              Type={item.type}
            />
          )}
        />
      </View>
    </SafeAreaView>
  )
}

export default TransactionScreen

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    textAlign: 'left',
    marginBottom: 10,
    marginLeft: 11,
    fontWeight: 'bold',
    color: theme.colors.dark,
  },
})
