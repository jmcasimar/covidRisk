import firebase from 'react-native-firebase';
import React, { Component } from 'react';
import {StatusBar, StyleSheet, View, Text } from 'react-native';
import { getUniqueId, getManufacturer, getMacAddress } from 'react-native-device-info';
import GetLocation from 'react-native-get-location';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import Parse from 'parse/react-native';
import { Card, CardSection, Input, Button, Spinner, Header, DropInput } from './../common';


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

  static navigationOptions = {
    title: 'Maps',
  };

    constructor () {
        super();

        this.state={
      location: '',
      locationArray: [],
      localLocArray: [],
      cloudLocArray: []
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

  this.cargar('localLocArray', 'array');
  const ref = firebase.firestore().collection('ubicaciones').doc(address);

  ref.get().then((doc) => {
    if (doc.exists) {
        const cloudLocArray = doc.data().cloudLocArray;
        this.setState({ cloudLocArray })

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
  let {localLocArray, location} = this.state;
  if(Array.isArray(localLocArray)) {
      if (location && location !== NaN) {
      localLocArray.push(location)
    }
  } else {
  localLocArray = new Array()
  localLocArray.push(location)
}
this.guardar('localLocArray',localLocArray, 'array')
this.setState({localLocArray});
}

guardar = async(name, value, type) => {
  let object = value;
  if (type === 'array') {object = JSON.stringify(value)}
  try {
  await AsyncStorage.setItem(`@${name}`, object);
} catch (error) {
  console.log('Error')
} finally {
  console.log(`Guardado ${type} ${name} ${object.length}`)
}
}

cargar = async(name, type) => {
  console.log('cargando')
try {
  const myArray = await AsyncStorage.getItem(`@${name}`);
  console.log('leido', myArray)
  if (myArray !== null) {
    let object = []
    let newArray = myArray;
    if(type === 'array') {newArray = JSON.parse(myArray)}
    newArray.forEach((el) => {
      if (el && el !== NaN) {
        object.push(el)
      }
    })
      console.log('Convertido', object)
    this.setState({[name]: object})
  }
} catch (error) {
  console.log(`No se pudo cargar ${error}`)
} finally {
}
}

limpiar = async(name) => {
  try {
    await AsyncStorage.removeItem(`@${name}`)
  } catch(e) {
      console.log(`No se pudo limpiar ${e}`)
  }
  console.log('Limpiado.')
  this.setState({ [name]: []})
}

joinLocationArrays() {

  const{ localLocArray, cloudLocArray } = this.state;
  console.log('cloud', cloudLocArray.length)
console.log('localArray',localLocArray.length)
  let locationArray = [];
if((cloudLocArray && cloudLocArray !== []) && (localLocArray && localLocArray !== [])) { locationArray = [...cloudLocArray, ...localLocArray] }
else if(!cloudLocArray || cloudLocArray === [] ) { locationArray = localLocArray }
else if(!localLocArray || localLocArray === []) { locationArray = cloudLocArray }
console.log('locatArray',locationArray.length)
  return [locationArray, cloudLocArray, localLocArray];
}

upload() {
  const { macaddress } = this.state

  const [locationArray, cloudLocArray, localLocArray] = this.joinLocationArrays();

  const ref = firebase.firestore().collection('ubicaciones').doc(macaddress);

  firebase
    .firestore()
    .runTransaction(async transaction => {
      const doc = await transaction.get(ref);


      transaction.set(ref, { cloudLocArray: locationArray });

    })
    .then(() => {
        this.limpiar('localLocArray');
        console.log('newLoc', locationArray)
        this.setState({ cloudLocArray: locationArray })
      console.log(
        `Transaction successfully committed.`
      );
    })
    .catch(error => {
      console.log('Transaction failed: ', error);
    });

if (false) {
}

}

render() {


const { location } = this.state;

const [locationArray, cloudLocArray, localLocArray] = this.joinLocationArrays();

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
       <View style={styles.container}>
         <MapView
           style={styles.map}
           region={location}
         >
         {locationArray.map(marker => {
           if (marker && marker !== NaN) {
             return (
    <Marker
    coordinate={{
      latitude: marker.latitude,
      longitude: marker.longitude
    }}
    />
  );
  }})}
          </MapView>
          <View>
          <Button onPress={() => this.upload()}>
          Cargar info
          Ubicaciones locales: {localLocArray.length}
          Ubicaciones en la nube: {cloudLocArray.length}
          Ubicaciones mostradas: {locationArray.length}
          </Button>
          </View>
       </View>
    );
  }
  return (
         <View style={styles.container}>
         <View>
         <Button onPress={() => this.upload()}>
         Cargar info
         </Button>
         </View>
         </View>
      );
  }
}
