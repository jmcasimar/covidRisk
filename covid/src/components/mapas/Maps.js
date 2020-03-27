import firebase from 'react-native-firebase';
import React, { Component } from 'react';
import {StatusBar, StyleSheet, View } from 'react-native';
import { getUniqueId, getManufacturer, getMacAddress } from 'react-native-device-info';
import GetLocation from 'react-native-get-location';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import Parse from 'parse/react-native';

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   height: 400,
   width: 400,
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
});

export default class Maps extends Component {

  constructor () {
      super();

      this.state={
    location: '',
    locationArray: []
    }
  }

  componentDidMount() {

  firebase.auth()
  .signInAnonymously()
  .then(credential => {
    if (credential) {
      console.log('default app user ->', credential.user.toJSON());
    }
  });

  getMacAddress().then(mac => {
      this.state.macaddress = mac
      this.cargarUbicaciones(mac)
  });
      this.interval = setInterval(() => this.tick(), 1000);
      this.interval2 = setInterval(() => this.tock(), 50000);
      this.interval3 = setInterval(() => this.upload(), 10000);
      GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
  })
  .then(location => {
    location.latitudeDelta = 0.015;
    location.longitudeDelta = 0.0121;

    this.setState({location})
  })
  .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
  })

}

cargarUbicaciones(address) {
  const ref = firebase.firestore().collection('ubicaciones').doc(address);

  ref.get().then((doc) => {
    if (doc.exists) {
        const locationArray = doc.data().locationArray;
        console.log('queryarray', locationArray)
        this.setState({locationArray})
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });

}


tick() {
  GetLocation.getCurrentPosition({
  enableHighAccuracy: true,
  timeout: 15000,
    }).then((location, state) => {
      location.latitudeDelta = 0.015;
      location.longitudeDelta = 0.0121;

      this.setState({location});
    })
}

tock() {
  let {locationArray, location} = this.state;
  if(Array.isArray(locationArray)) {

    locationArray.push(location)
  } else {
  locationArray = new Array()
  locationArray.push(location)
}

this.setState({locationArray});

}

upload() {
  const { locationArray, macaddress } = this.state
console.log('macAddress', macaddress)
  const ref = firebase.firestore().collection('ubicaciones').doc(macaddress);

  firebase
    .firestore()
    .runTransaction(async transaction => {
      const doc = await transaction.get(ref);


      transaction.set(ref, { locationArray });

    })
    .then(newLocationArray => {
      console.log(
        `Transaction successfully committed.`
      );
    })
    .catch(error => {
      console.log('Transaction failed: ', error);
    });

if (false) {
  this.setState({ locationArray: [] })
}

}

render() {
const { location } = this.state;
if (location !== '') {
return (
       <View style={styles.container}>
         <MapView
           style={styles.map}
           region={location}
         >
         {this.state.locationArray.map(marker => (
    <Marker
    coordinate={{
      latitude: location.latitude,
      longitude: location.longitude
    }}
    />
  ))}
          </MapView>
       </View>
    );
  }
  return (
         <View style={styles.container}>

         </View>
      );
  }
}
