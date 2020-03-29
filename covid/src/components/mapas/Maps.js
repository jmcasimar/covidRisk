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
  let points = [
  	{latitude:49.986111, longitude:20.061667, weight: 1},
  	{latitude:50.193139, longitude:20.288717, weight: 2},
  	{latitude:49.740278, longitude:19.588611, weight: 1},
  	{latitude:50.061389, longitude:19.938333, weight: 8},
  	{latitude:50.174722, longitude:20.986389, weight: 11},
  	{latitude:50.064507, longitude:19.920777, weight: 98},
  	{latitude:49.3, longitude:19.95, weight: 41},
  	{latitude:49.833333, longitude:19.940556, weight: 66},
  	{latitude:49.477778, longitude:20.03, weight: 9},
  	{latitude:49.975, longitude:19.828333, weight: 11},
  	{latitude:50.357778, longitude:20.0325, weight: 33},
  	{latitude:50.0125, longitude:20.988333, weight: 76},
  	{latitude:50.067959, longitude:19.91266, weight: 63},
  	{latitude:49.418588, longitude:20.323788, weight: 52},
  	{latitude:49.62113, longitude:20.710777, weight: 88},
  	{latitude:50.039167, longitude:19.220833, weight: 1},
  	{latitude:49.970495, longitude:19.837214, weight: 78},
  	{latitude:49.701667, longitude:20.425556, weight: 1},
  	{latitude:50.078429, longitude:20.050861, weight: 1},
  	{latitude:49.895, longitude:21.054167, weight: 1},
  	{latitude:50.27722, longitude:19.569658, weight: 65},
  	{latitude:49.968889, longitude:20.606389, weight: 1},
  	{latitude:49.51232, longitude:19.63755, weight: 1},
  	{latitude:50.018077, longitude:20.989849, weight: 35},
  	{latitude:50.081698, longitude:19.895629, weight: 22},
  	{latitude:49.968889, longitude:20.43, weight: 54},
  	{latitude:50.279167, longitude:19.559722, weight: 1},
  	{latitude:50.067947, longitude:19.912865, weight: 69},
  	{latitude:49.654444, longitude:21.159167, weight: 1},
  	{latitude:50.099606, longitude:20.016707, weight: 80},
  	{latitude:50.357778, longitude:20.0325, weight: 99},
  	{latitude:49.296628, longitude:19.959694, weight: 1},
  	{latitude:50.019014, longitude:21.002474, weight: 46},
  	{latitude:50.056829, longitude:19.926414, weight: 22},
  	{latitude:49.616667, longitude:20.7, weight: 1},
  	{latitude:49.883333, longitude:19.5, weight: 33},
  	{latitude:50.054217, longitude:19.943289, weight: 1},
  	{latitude:50.133333, longitude:19.4, weight: 100}
  ];

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
       <MapView.Heatmap points={[{latitude: location.latitude, longitude: location.longitude, weight: 100},
                                 {latitude: location.latitude+0.1, longitude: location.longitude+.1, weight: 100}]}
                         opacity={1}
                         radius={20}
                         maxIntensity={100}
                         gradientSmoothing={10}
                         heatmapMode={"POINTS_DENSITY"}/>
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
