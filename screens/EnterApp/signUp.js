import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image, KeyboardAvoidingView, AsyncStorage, Alert } from 'react-native';
import scale from '../../utils/scale'
import * as firebase from 'firebase'
import writeClubData from "../../utils/writeClubData"
import firebaseConfig from '../../private/databaseConfig'

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
	  {children}
	</TouchableWithoutFeedback>
);

var temp = "false";
//AsyncStorage.setItem("loggedIn", "false");
AsyncStorage.getItem("loggedIn").then((value) => {
  temp = JSON.parse(value);
  if(temp == null){
    temp = "false";
  }
  else if(temp == "true"){
    //getUserData();
  }
}).done();

export default class SignUp extends React.Component {

  constructor(props) {
		super(props)
		this.state = {
      //Username
      input1:"",
      //Email
      input2:"",
      //First Name
      input4:"",
      //Last Name
      input5:"",
    };
  }
  
  login = () => {
    this.props.navigation.navigate('LogIn');
  }

  signup = () => {
    var username = this.state.input1.toLowerCase();
    var email = this.state.input2;
    if(email.indexOf("@") >= 0 && email.indexOf(".") > email.indexOf("@")){
      firebase.database().ref('info').once('value', (dat_a) => {
        dat_a = dat_a.toJSON();
        email = email.replace(".", ",")
        if(dat_a != undefined){
          var existsStaff = false;
          var existsUser = false;
          var emailExists = false;
          if(dat_a["users"] != undefined){
            var keys = Object.keys(dat_a["users"]);
            for(i = 0; i < Object.keys(dat_a["users"]).length; i++){
              if(username == keys[i]){
                existsUser = true;
              }
            }
          }
          if(dat_a["emails"] != undefined){
            var keys = Object.keys(dat_a["emails"]);
            for(i = 0; i < Object.keys(dat_a["emails"]).length; i++){
              if(email == keys[i]){
                existsUser = true;
                emailExists = true;
              }
            }
          }
          if(dat_a["staffs"] != undefined){
            var keys = Object.keys(dat_a["staffs"]);
            for(i = 0; i < Object.keys(dat_a["staffs"]).length; i++){
              if(username == keys[i]){
                existsStaff = true;
              }
            }
          }
          if(dat_a['staff emails'] != undefined){
            var keys = Object.keys(dat_a["staff emails"]);
            for(i = 0; i < Object.keys(dat_a['staff emails']).length; i++){
              if(email == keys[i]){
                existsStaff = true;
                emailExists = true;
              }
            }
          }
          if(existsStaff == false && existsUser == false){
            this.props.navigation.navigate('SignUp2', {first:this.state.input4, last:this.state.input5, email:this.state.input2, username:this.state.input1.toLowerCase()})
          }
          else{
            if(!emailExists){
              Alert.alert(
                'Username Exists',
                'Please choose another username',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
              );
            }
            else{
              Alert.alert(
                'Email Taken',
                'Please choose another email',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
              );
            }
          }
        }
        else{
          this.props.navigation.navigate('SignUp2', {first:this.state.input4, last:this.state.input5, email:this.state.input2, username:this.state.input1.toLowerCase()})
        }
      });
    }
    else{
      Alert.alert(
        'Invalid Email',
        'Please choose another email',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    }
  }

  componentDidMount(){
    if(temp == true){
      this.props.navigation.navigate('Home')
    }
  }

  render() {
    return (
        <View style={styles.container}>
          <KeyboardAvoidingView keyboardVerticalOffset={-scale(120, 1)} behavior={"position"} enabled>
            <DismissKeyboard>
              <View style={styles.container}>
                {/*Top*/}
                <View>
                  <Image
                    source={require("../../assets/logo.png")}
                    style={{
                      height: scale(120, 1),
                      width: scale(240, 1),
                      marginBottom: scale(50, 1)
                    }}
                  />
                </View>

                {/*Middle*/}
                <View>
                  <View style={styles.row}>
                    <TextInput
                      style={styles.inputHalf}
                      placeholder="First Name"
                      onChangeText={(text) => this.setState({input4:text})}
                      />
                      <TextInput
                      style={styles.inputHalf}
                      placeholder="Last Name"
                      onChangeText={(text) => this.setState({input5:text})}
                      />
                  </View>
                  
                  {/*Email*/}
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize = 'none'
                    onChangeText={(text) => this.setState({input2: text})}
                    />

                  {/*Username*/}
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={(text) => this.setState({input1:text})}
                    />
                </View>

                {/*Sign Up Button*/}
                <View>
                  <TouchableOpacity style={styles.submit} onPress={this.signup}>
                    <Text style={styles.color1}>Next</Text>
                  </TouchableOpacity>
                </View>

                {/*Bottom*/}
                <View>
                  {/*Log in option*/}
                  <View style={styles.row}>
                    <Text>Already a member? </Text>
                    <TouchableOpacity onPress={this.login}>
                      <Text style={styles.color2}>Log In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </DismissKeyboard>
          </KeyboardAvoidingView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#efefef",
    width: scale(375, 0)
  },
  bold: {
      fontWeight: '100'
  },
  input: {
    borderColor: "#474747",
    borderWidth: scale(1, 0),
    padding: scale(15, 1),
    width: scale(250, 0),
    margin: scale(10, 1),
    fontSize: scale(15, 1)
  },
  inputHalf: {
    borderColor: "#474747",
    borderWidth: scale(1, 0),
    padding: scale(15, 1),
    width: scale(115, 0),
    margin: scale(10, 1),
    fontSize: scale(15, 1)
  },
  submit: {
    backgroundColor: "#e8da1b",
    borderRadius: scale(15, 1),
    padding: scale(15, 1),
    margin: scale(30, 1),
    marginTop: scale(20, 1)
  },
  color1: {
    color: "#ffffff"
  },
  color2: {
    color: "#cec116"
  },
  row: {
    flexDirection: 'row'
  }
});