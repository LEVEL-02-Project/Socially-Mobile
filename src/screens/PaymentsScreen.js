import React, { useState } from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import {
  CardField,
  useStripe,
  useConfirmPayment,
} from '@stripe/stripe-react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { theme } from '../core/theme'
import { Button, TextInput } from 'react-native-paper'
import Apptext from '../components/AppText'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { API } from '../navigation/host'
import { nameValidator } from '../helpers/nameValidator'
import * as SecureStore from 'expo-secure-store'

const PaymentsScreen = ({ route , navigation }) => {
  const [card, setCard] = useState({ cardNumber: '', expDate: '', cvc: '' })
  const [cardHolder, setCardHolder] = useState({ value: '', error: '' })
  const { confirmPayment, loading } = useConfirmPayment()
  const [text, setText] = React.useState("");
  const [amountError, setAmountError] = React.useState();
  const { amount } = route.params;

  async function onConfirmPresed() {
    let userToken = await SecureStore.getItemAsync('userToken')

    if(text>amount){
      setAmountError("Amount must be greater than or equal to $ "+amount)
    } else {
      const date = new Date().toLocaleString()

      var axios = require('axios');
      var data = JSON.stringify({
        "amount": text,
        "date": date,
        "type": "withdrawal",
      });

      var config = {
          method: 'post',
          url:  API.host+'publisher-transaction/withdraw',
          headers: { 
              Authorization: `Bearer ${userToken}`,
              'Content-Type': 'application/json'
          },
          data : data
      };
      axios(config)
      .then(function (response) {
          console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
          console.log(error);
      });
    }
  }

  const handlePayPress = async () => {
    if (!card) {
      return
    }
    const billingDetails = {
      email: 'jenny.rosen@example.com',
    }

    const clientSecret = await fetchPaymentIntentClientSecret()
    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      paymentMethodType: 'card',
      paymentMethodData: {
        billingDetails,
      },
    })

    if (error) {
      console.log('Payment confirmation error', error)
    } else if (paymentIntent) {
      console.log('Success from promise', paymentIntent)
    }
  }

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch('http://localhost:3000/stripe/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'usd',
        paymentMethodType: 'card',
      }),
    })
    const { clientSecret } = await response.json()
    return clientSecret
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Image
          source={require('../assets/DebitCard5.png')}
          style={styles.cardImage}
        />
        <View style={styles.amountSection}>
          <Apptext style={styles.text}>Current Amount </Apptext>
          <View style={{ flexDirection: 'row' }}>
            <Apptext children="US$" style={styles.amountStyle} />
            <Apptext children={amount} style={styles.amountStyle} />
          </View>
        </View>
      </View>

      <View style={{ backgroundColor: 'white' }}>
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          style={styles.cardField}
          onCardChange={(cardDetails) => {
            console.log('cardDetails', cardDetails)
          }}
          onFocus={(focusedField) => {
            console.log('focusField', focusedField)
          }}
        />
        <View style={styles.inputContainer}>
          <TextInput
            label="amount  $"
            onChangeText={text => setText(text)}
            autoCorrect={false}
            style={styles.amountInput}
            underlineColor={theme.colors.primary}
            backgroundColor={theme.colors.white}

            // error={!!cardHolder.error}
            // errorText={cardHolder.error}
          />
          <TextInput
            label="Card Holder"
            autoCorrect={false}
            style={styles.cardholderInput}
            underlineColor={theme.colors.primary}
            backgroundColor={theme.colors.white}
            // onChangeText={(text) => setAmount(text)}
            // error={!!amount.error}
            // errorText={amount.error}
          />
        </View>

        <View
          style={{ flexDirection: 'row', marginLeft: '8%', marginBottom: 25 }}
        >
          {/* <MaterialCommunityIcons
            name="information-outline"
            size={15}
            color={theme.colors.medium}
          />
          <Text style={{ color: theme.colors.medium, marginLeft: 6 }}>
            Minimun withdrawal amount : $10
          </Text> */}

          { amountError ? (
            <Text style={{ color: theme.colors.error, marginLeft: 6 }}>Amount must be greater than or equal to {amount}</Text>
          ) : null}
          {/* {errorText ? <Text style={styles.error}>{errorText}</Text> : null} */}
        </View>

        <Button
          mode="contained"
          uppercase={true}
          height={45}
          width={'85%'}
          marginBottom={70}
          alignSelf={'center'}
          labelStyle={styles.labelStyle}
          onPress={onConfirmPresed}
          disabled={loading}
        >
          Confirm
        </Button>
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  cardImage: {
    width: '113%',
    height: '50%',
    marginTop: '3%',
    resizeMode: 'contain',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 50 },
  },
  cardField: {
    width: '85%',
    height: 45,
    marginBottom: 20,
    alignSelf: 'center',
    borderColor: theme.colors.primary,
    // borderWidth: 1,
    borderRadius: 5,
  },
  labelStyle: {
    fontSize: 17,
    alignSelf: 'center',
    marginTop: 13,
  },
  amountStyle: {
    fontSize: 30,
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: '2%',
  },
  amountSection: {
    marginLeft: '7.5%',
  },
  text: {
    fontSize: 17,
    color: theme.colors.mediumGrey,
  },
  amountInput: {
    width: '45%',
    alignSelf: 'flex-start',
    marginLeft: '13%',
    borderColor: theme.colors.primary,
    height: 44,
    marginBottom: 10,
  },
  cardholderInput: {
    width: '90%',
    borderBottomColor: theme.colors.primary,
    borderBottomEndRadius: 5,
    height: 44,
    marginBottom: 10,
    marginLeft: '5%',
  },
  iconText: {
    color: theme.colors.medium,
    fontSize: 15,
    paddingHorizontal: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '60%',
  },
})

export default PaymentsScreen
