import firebase from 'react-native-firebase';
import React, { Component } from 'react';
import {StatusBar, StyleSheet, View } from 'react-native';
import { getUniqueId, getManufacturer, getMacAddress } from 'react-native-device-info';
import GetLocation from 'react-native-get-location';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { Card, CardSection } from '../common';

const styles = StyleSheet.create({
 container: {
   height: 400,
   width: 400,
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
 qrStyle: {
   justifyContent: 'center',
   alignItems: 'center'
 }
});

export default class Maps extends Component {

  static navigationOptions = {
    title: 'Maps',
  };

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
    this.interval2 = setInterval(() => this.tock(), 5000);
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
        const ref1 = firebase.firestore().collection('ubicaciones').where('riesgo', '==', 60);
        ref1.get().then((doc1) => {
          console.log(doc1, 'DOC TEST');
        }).catch(function(error) {
          console.log('PTM2', error);
        });
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
  let qrInfo = 'tos:';
  qrInfo += this.state.tos;
  qrInfo += ',escalofrios:';
  qrInfo += this.state.escalofrios;
  qrInfo += ',diarrea:';
  qrInfo += this.state.diarrea;
  qrInfo += ',garganta:';
  qrInfo += this.state.garganta;
  qrInfo += ',malestarGeneral:';
  qrInfo += this.state.malestarGeneral;
  qrInfo += ',dolorCabeza:';
  qrInfo += this.state.dolorCabeza;
  qrInfo += ',fiebre:';
  qrInfo += this.state.fiebre;
  qrInfo += ',perdidaOlfato:';
  qrInfo += this.state.perdidaOlfato;
  qrInfo += ',dificultadRespirar:';
  qrInfo += this.state.dificultadRespirar;
  qrInfo += ',fatiga:';
  qrInfo += this.state.fatiga;
  qrInfo += ',viajadoRecientemente:';
  qrInfo += this.state.viajadoRecientemente;
  qrInfo += ',contactoAreaInfectada:';
  qrInfo += this.state.contactoAreaInfectada;
  qrInfo += ',contactoPacientePositivo:';
  qrInfo += this.state.contactoPacientePositivo;

return (
  <View>
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
  </View>
    );
  }
  return (
         <View style={styles.container}>

         </View>
      );
  }
}
