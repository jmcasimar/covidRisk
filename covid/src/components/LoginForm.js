import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, Alert } from 'react-native';
import Parse from 'parse/react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Card, CardSection, Input, Button, Spinner, Header, DropInput } from './common';
import { emailChanged, passwordChanged, loginUser, session } from '../actions';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-community/async-storage';
import QRCode from 'react-native-qrcode-svg';

class LoginForm extends Component {
  static navigationOptions = {
    headerShown: false  //this will hide the header
  };

  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      edad: '',
      sexo: '',
      tos: '',
      escalofrios: '',
      diarrea: '',
      garganta: '',
      malestarGeneral: '',
      dolorCabeza: '',
      fiebre: '',
      perdidaOlfato: '',
      dificultadRespirar: '',
      fatiga: '',
      viajadoRecientemente: '',
      contactoAreaInfectada: '',
      contactoPacientePositivo: '',
      requestAgain: false
    };
  }



  componentDidMount() {
    aceptarPrivacidad = async () => {
      await AsyncStorage.setItem('avisoPrivacidad', 'si');
    }

    getData = async () => {
    try {
      const privacidad = `Con la finalidad de respetar la privacidad de todos los usuarios, la aplicación únicamente guarda la información recolectada dentro de su dispósitivo.
      Sin embargo, si usted así lo decide puede compartir esa información con nuestros servidores con la finalidad de apoyar al resto de la comunidad que cuente con la aplicación a evaluar el estado actual de riesgo de exposición al COVID-19 en su comunidad.
      La información recolectada es estrictamente anónima y puede ser de utilidad para las instituciones académicas y gubernamentales a recolectar información que les ayuden a tomar mejores decisiones durante el desarrollo de la pandemia.
      Nunca se subirá la información de manera automática, siempre la acción será activada por el usuario y se le pedirá confirmación antes de subirla.
      El código fuente de la applicación es abierto y puede ser encontrado en la siguiente dirección: https://github.com/jmcasimar/covidRisk/. Cualquier persona que desee colaborar ya sea aportando ideas o el desarrollo de la app se puede contactar a los siguientes correos: jmcasimar@healtech.com.mx y klavierema@healtech.com.mx`;

      let avisoPrivacidad = await AsyncStorage.getItem('avisoPrivacidad');
      if(avisoPrivacidad === null) {
        Alert.alert(
          'Aviso de Privacidad:',
          privacidad,
          [{ text: 'Ok', onPress: () => aceptarPrivacidad() }],
          { cancelable: false }
        );
      }

      let tos = await AsyncStorage.getItem('tos')
      if(tos === null) { tos = 'no'; }

      let escalofrios = await AsyncStorage.getItem('escalofrios')
      if(escalofrios === null) { escalofrios = 'no'; }

      let diarrea = await AsyncStorage.getItem('diarrea')
      if(diarrea === null) { diarrea = 'no'; }

      let garganta = await AsyncStorage.getItem('garganta')
      if(garganta === null) { garganta = 'no'; }

      let malestarGeneral = await AsyncStorage.getItem('malestarGeneral')
      if(malestarGeneral === null) { malestarGeneral = 'no'; }

      let dolorCabeza = await AsyncStorage.getItem('dolorCabeza')
      if(dolorCabeza === null) { dolorCabeza = 'no'; }

      let fiebre = await AsyncStorage.getItem('fiebre')
      if(fiebre === null) { fiebre = 'no'; }

      let perdidaOlfato = await AsyncStorage.getItem('perdidaOlfato')
      if(perdidaOlfato === null) { perdidaOlfato = 'no'; }

      let dificultadRespirar = await AsyncStorage.getItem('dificultadRespirar')
      if(dificultadRespirar === null) { dificultadRespirar = 'no'; }

      let fatiga = await AsyncStorage.getItem('fatiga')
      if(fatiga === null) { fatiga = 'no'; }

      let viajadoRecientemente = await AsyncStorage.getItem('viajadoRecientemente')
      if(viajadoRecientemente === null) { viajadoRecientemente = 'no'; }

      let contactoAreaInfectada = await AsyncStorage.getItem('contactoAreaInfectada')
      if(contactoAreaInfectada === null) { contactoAreaInfectada = 'no'; }

      let contactoPacientePositivo = await AsyncStorage.getItem('contactoPacientePositivo')
      if(contactoPacientePositivo === null) { contactoPacientePositivo = 'no'; }

      this.setState({
        tos,
        escalofrios,
        diarrea,
        garganta,
        malestarGeneral,
        dolorCabeza,
        fiebre,
        perdidaOlfato,
        dificultadRespirar,
        fatiga,
        viajadoRecientemente,
        contactoAreaInfectada,
        contactoPacientePositivo
      });
      console.log('AsyncStorage info obtenida', this.setState());
    } catch(e) {
      console.log('AsyncStorage Read error:', e);
      }
    }
    getData();
  }

  goToMaps() {
    this.props.navigation.navigate('Maps');
  }

  onRequestAgain() {
    this.setState({ requestAgain: true });
  }

  showQr(){
    this.setState({ requestAgain: false });
  }

  onContinuarPress() {
    storeData = async () => {
      try {
        if (this.state.tos){ await AsyncStorage.setItem('tos', 'si'); }
        else { await AsyncStorage.setItem('tos', 'no'); }

        if (this.state.escalofrios){ await AsyncStorage.setItem('escalofrios', 'si'); }
        else { await AsyncStorage.setItem('escalofrios', 'no'); }

        if (this.state.diarrea){ await AsyncStorage.setItem('diarrea', 'si'); }
        else { await AsyncStorage.setItem('diarrea', 'no'); }

        if (this.state.garganta){ await AsyncStorage.setItem('garganta', 'si'); }
        else { await AsyncStorage.setItem('garganta', 'no'); }

        if (this.state.malestarGeneral){ await AsyncStorage.setItem('malestarGeneral', 'si'); }
        else { await AsyncStorage.setItem('malestarGeneral', 'no'); }

        if (this.state.dolorCabeza){ await AsyncStorage.setItem('dolorCabeza', 'si'); }
        else { await AsyncStorage.setItem('dolorCabeza', 'no'); }

        if (this.state.malestarGeneral){ await AsyncStorage.setItem('malestarGeneral', 'si'); }
        else { await AsyncStorage.setItem('malestarGeneral', 'no'); }

        if (this.state.fiebre){ await AsyncStorage.setItem('fiebre', 'si'); }
        else { await AsyncStorage.setItem('fiebre', 'no'); }

        if (this.state.perdidaOlfato){ await AsyncStorage.setItem('perdidaOlfato', 'si'); }
        else { await AsyncStorage.setItem('perdidaOlfato', 'no'); }

        if (this.state.dificultadRespirar){ await AsyncStorage.setItem('dificultadRespirar', 'si'); }
        else { await AsyncStorage.setItem('dificultadRespirar', 'no'); }

        if (this.state.fatiga){ await AsyncStorage.setItem('fatiga', 'si'); }
        else { await AsyncStorage.setItem('fatiga', 'no'); }

        if (this.state.viajadoRecientemente){ await AsyncStorage.setItem('viajadoRecientemente', 'si'); }
        else { await AsyncStorage.setItem('viajadoRecientemente', 'no'); }

        if (this.state.contactoAreaInfectada){ await AsyncStorage.setItem('contactoAreaInfectada', 'si'); }
        else { await AsyncStorage.setItem('contactoAreaInfectada', 'no'); }

        if (this.state.contactoPacientePositivo){ await AsyncStorage.setItem('contactoPacientePositivo', 'si'); }
        else { await AsyncStorage.setItem('contactoPacientePositivo', 'no'); }

        this.setState({ requestAgain: true });
        console.log('Encuesta Guardada');

      } catch (e) {
        console.log('AsyncStorage Error:', e);
      }
    }

    storeData();
    let puntaje = 0;
    if (this.state.tos === 'si') { puntaje += 1; }
    if (this.state.escalofrios === 'si') { puntaje += 1; }
    if (this.state.diarrea === 'si') { puntaje += 1; }
    if (this.state.garganta === 'si') { puntaje += 1; }
    if (this.state.malestarGeneral === 'si') { puntaje += 1; }
    if (this.state.dolorCabeza === 'si') { puntaje += 1; }
    if (this.state.fiebre === 'si') { puntaje += 1; }
    if (this.state.perdidaOlfato === 'si') { puntaje += 1; }
    if (this.state.dificultadRespirar === 'si') { puntaje += 2; }
    if (this.state.fatiga === 'si') { puntaje += 2; }
    if (this.state.viajadoRecientemente === 'si') { puntaje += 3; }
    if (this.state.contactoAreaInfectada === 'si') { puntaje += 3; }
    if (this.state.contactoPacientePositivo === 'si') { puntaje += 3; }

    let recomendacion = '';
    if (puntaje<=2) { recomendacion = 'Podría ser estrés, tomé sus precauciones y observe'; }
    else if (puntaje<=5) { recomendacion = 'Hidrátese, conserve medidas de higiene, observe y reevalúe en 2 días'; }
    else if (puntaje<=11) { recomendacion = 'Acuda a consulta con el médico'; }
    else { recomendacion = 'Llame a los servicios para realizar prueba COVID-19'; }

    Alert.alert(
      'Recomendación:',
      recomendacion,
      [{ text: 'Ok', onPress: () => this.showQr() }],
      { cancelable: false }
    );
    //this.props.navigation.navigate('SignUp');
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    }

    return (
      <Button onPress={this.onContinuarPress.bind(this)}>
        Continuar
      </Button>
    );
  }

  renderError() {
    if (this.props.error) {
      console.log(this.props.error);
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Text style={styles.errorTextStyle}>
            {this.props.error}
          </Text>
        </View>
      );
    }
  }

  render() {
    console.log(this.state);

    const { requestAgain, edad, sexo, tos, escalofrios, diarrea, garganta,
    malestarGeneral, dolorCabeza, fiebre, perdidaOlfato, dificultadRespirar,
    fatiga, viajadoRecientemente, contactoAreaInfectada, contactoPacientePositivo } = this.state;

    if( requestAgain===false && tos!=='' && escalofrios!=='' && diarrea!=='' && garganta!=='' &&
      malestarGeneral!=='' && dolorCabeza!=='' && fiebre!=='' && perdidaOlfato!=='' && dificultadRespirar!=='' &&
      fatiga!=='' && viajadoRecientemente!=='' && contactoAreaInfectada!=='' && contactoPacientePositivo!=='' ){
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
        <Card>
          <CardSection>
            <Text style={{color: 'white'}}>*************</Text>
             <View style={styles.qrStyle}>
               <QRCode
                 value={qrInfo}
                 size={200}
               />
             </View>
          </CardSection>
          <CardSection>
            <Button onPress={this.onRequestAgain.bind(this)}>
              Contestar nuevamente la encuesta
            </Button>
          </CardSection>
          <CardSection>
            <Button onPress={this.goToMaps.bind(this)}>
              Ir a mapa
            </Button>
          </CardSection>
        </Card>
      );
    }
    const radio_sexo = [
      {label: 'Masculino', value: 0 },
      {label: 'Femenino', value: 1 }
    ];

    const radio_bool = [
      {label: 'No', value: 0 },
      {label: 'Sí', value: 1 }
    ];

    if (this.props.loggedIn) {
      this.props.navigation.navigate('Stack');
    }

    let sexo0 = 0;
    if (sexo==='Masculino') { sexo0 = 1; }

    let tos0 = 0;
    if (tos==='si') { tos0 = 1; }

    let escalofrios0 = 0;
    if (escalofrios==='si') { escalofrios0 = 1; }

    let diarrea0 = 0;
    if (diarrea==='si') { diarrea0 = 1; }

    let garganta0 = 0;
    if (garganta==='si') { garganta0 = 1; }

    let malestarGeneral0 = 0;
    if (malestarGeneral==='si') { malestarGeneral0 = 1; }

    let dolorCabeza0 = 0;
    if (dolorCabeza==='si') { dolorCabeza0 = 1; }

    let fiebre0 = 0;
    if (fiebre==='si') { fiebre0 = 1; }

    let perdidaOlfato0 = 0;
    if (perdidaOlfato==='si') { perdidaOlfato0 = 1; }

    let dificultadRespirar0 = 0;
    if (dificultadRespirar==='si') { dificultadRespirar0 = 1; }

    let fatiga0 = 0;
    if (fatiga==='si') { fatiga0 = 1; }

    let viajadoRecientemente0 = 0;
    if (viajadoRecientemente==='si') { viajadoRecientemente0 = 1; }

    let contactoAreaInfectada0 = 0;
    if (contactoAreaInfectada==='si') { contactoAreaInfectada0 = 1; }

    let contactoPacientePositivo0 = 0;
    if (contactoPacientePositivo==='si') { contactoPacientePositivo0 = 1; }

    return (
      <KeyboardAwareScrollView>
        <Header headerText="Pre-evaluación" />

        <CardSection>
          <Input
            label="Edad"
            placeholder="20"
            onChangeText={(text) => { this.setState({ edad: text })} }
            value={this.state.edad}
            keyboardType="numeric"
          />
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>Sexo:</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_sexo}
              initial={sexo0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({sexo: 'Masculino'});
                } else { this.setState({sexo: 'Femenino'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>¿Tienes tos?</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_bool}
              initial={tos0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({tos: 'si'});
                } else { this.setState({tos: 'no'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>¿Tienes escalofríos?</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_bool}
              initial={escalofrios0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({escalofrios: 'si'});
                } else { this.setState({escalofrios: 'no'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>En este momento o en días previos, ¿has tenido diarrea?</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_bool}
              initial={diarrea0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({diarrea: 'si'});
                } else { this.setState({diarrea: 'no'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>¿Tienes dolor de garganta?</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_bool}
              initial={garganta0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({garganta: 'si'});
                } else { this.setState({garganta: 'no'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>¿Tiene dolor de cuerpo o malestar general?</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_bool}
              initial={malestarGeneral0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({malestarGeneral: 'si'});
                } else { this.setState({malestarGeneral: 'no'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>¿Estás presentando dolores de cabeza?</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_bool}
              initial={dolorCabeza0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({dolorCabeza: 'si'});
                } else { this.setState({dolorCabeza: 'no'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>¿Has tenido fiebre? (Más de 37.8 °C)</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_bool}
              initial={fiebre0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({fiebre: 'si'});
                } else { this.setState({fiebre: 'no'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>¿Has perdido el olfato?</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_bool}
              initial={perdidaOlfato0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({perdidaOlfato: 'si'});
                } else { this.setState({perdidaOlfato: 'no'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>¿Estas teniendo dificultad para respirar? (Como si no entrara aire al pecho)</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_bool}
              initial={dificultadRespirar0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({dificultadRespirar: 'si'});
                } else { this.setState({dificultadRespirar: 'no'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>¿Estas experimentando fatiga?</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_bool}
              initial={fatiga0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({fatiga: 'si'});
                } else { this.setState({fatiga: 'no'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>¿Has viajado en los últimos 14 días?</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_bool}
              initial={viajadoRecientemente0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({viajadoRecientemente: 'si'});
                } else { this.setState({viajadoRecientemente: 'no'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>¿Has viajado o estado en un área infectada por COVID-19?</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_bool}
              initial={contactoAreaInfectada0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({contactoAreaInfectada: 'si'});
                } else { this.setState({contactoAreaInfectada: 'no'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        <CardSection>
          <Text style={styles.labelStyle}>¿Has estado en contacto directo o cuidando algún paciente positivo a COVID-19?</Text>
        </CardSection>
        <CardSection>
          <View style={styles.container}>
            <RadioForm
              radio_props={radio_bool}
              initial={contactoPacientePositivo0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              onPress={(value) => {
                if(value===1) {
                  this.setState({contactoPacientePositivo: 'si'});
                } else { this.setState({contactoPacientePositivo: 'no'}); }
              }}
            />
          </View>
          <View style={styles.container}/>
        </CardSection>

        {this.renderError()}

        <CardSection>
          {this.renderButton()}
        </CardSection>

      </KeyboardAwareScrollView>
    );
  }
}

const styles = {
  labelStyle: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 23,
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'white'
  },
  qrStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  }
};

const mapStateToProps = ({ auth }) => {
 const { email, password, error, loading, loggedIn } = auth;
 return { email, password, error, loading, loggedIn };
};

export default connect(mapStateToProps, {
  emailChanged, passwordChanged, loginUser, session
})(LoginForm);
