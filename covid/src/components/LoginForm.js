import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, Alert } from 'react-native';
import Parse from 'parse/react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Card, CardSection, Input, Button, Spinner, Header, DropInput } from './common';
import { emailChanged, passwordChanged, loginUser, session } from '../actions';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

class LoginForm extends Component {
  static navigationOptions = {
    headerShown: false  //this will hide the header
  };

  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      edad: '',
      sexo: 0,
      tos: 0,
      escalofrios: 0,
      diarrea: 0,
      garganta: 0,
      malestarGeneral: 0,
      dolorCabeza: 0,
      fiebre: 0,
      perdidaOlfato: 0,
      dificultadRespirar: 0,
      fatiga: 0,
      viajadoRecientemente: 0,
      contactoAreaInfectada: 0,
      contactoPacientePositivo: 0
    };
  }

  componentDidMount() {
    // console.log('Iniciar');
  }

  onAlertAccept() {
    this.props.navigation.navigate('Maps');
  }

  onContinuarPress() {
    let puntaje = 0;
    if (this.state.tos === 1) { puntaje += 1; }
    if (this.state.escalofrios === 1) { puntaje += 1; }
    if (this.state.diarrea === 1) { puntaje += 1; }
    if (this.state.garganta === 1) { puntaje += 1; }
    if (this.state.malestarGeneral === 1) { puntaje += 1; }
    if (this.state.dolorCabeza === 1) { puntaje += 1; }
    if (this.state.fiebre === 1) { puntaje += 1; }
    if (this.state.perdidaOlfato === 1) { puntaje += 1; }
    if (this.state.dificultadRespirar === 1) { puntaje += 2; }
    if (this.state.fatiga === 1) { puntaje += 2; }
    if (this.state.viajadoRecientemente === 1) { puntaje += 3; }
    if (this.state.contactoAreaInfectada === 1) { puntaje += 3; }
    if (this.state.contactoPacientePositivo === 1) { puntaje += 3; }

    let recomendacion = '';
    if (puntaje<=2) { recomendacion = 'Podría ser estrés, tomé sus precauciones y observe'; }
    else if (puntaje<=5) { recomendacion = 'Hidrátese, conserve medidas de higiene, observe y reevalúe en 2 días'; }
    else if (puntaje<=11) { recomendacion = 'Acuda a consulta con el médico'; }
    else { recomendacion = 'Llame a los servicios para realizar prueba COVID-19'; }

    Alert.alert(
      'Recomendación:',
      recomendacion,
      [{ text: 'Ok', onPress: () => this.onAlertAccept() }],
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({sexo: value})}}
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({tos: value})}}
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({escalofrios:value})}}
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({diarrea:value})}}
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({garganta: value})}}
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({malestarGeneral:value})}}
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({dolorCabeza:value})}}
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({fiebre:value})}}
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({perdidaOlfato:value})}}
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({dificultadRespirar:value})}}
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({fatiga:value})}}
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({viajadoRecientemente:value})}}
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({contactoAreaInfectada:value})}}
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
              initial={0}
              formHorizontal={true}
              labelHorizontal={false}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={(value) => {this.setState({contactoPacientePositivo:value})}}
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
  }
};

const mapStateToProps = ({ auth }) => {
 const { email, password, error, loading, loggedIn } = auth;
 return { email, password, error, loading, loggedIn };
};

export default connect(mapStateToProps, {
  emailChanged, passwordChanged, loginUser, session
})(LoginForm);
