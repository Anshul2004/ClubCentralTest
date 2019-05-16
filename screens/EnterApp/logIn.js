import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import scale from '../../utils/scale'
import * as firebase from 'firebase'
import firebaseConfig from '../../private/databaseConfig'

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
	  {children}
	</TouchableWithoutFeedback>
);

export default class SignUp extends React.Component {
  constructor(props) {
	super(props)
	this.state = {
      //Username
      input1:"",
      //Password
      input2:"",
    };
  }
    
  signup = () => {
    this.props.navigation.navigate('SignUp');
  }

  login = () => {
    var username = this.state.input1.toLowerCase();
    var password = this.state.input2;
    firebase.database().ref('info').once('value', (dat_a) => {
      dat_a = dat_a.toJSON();
      if(dat_a != undefined){
        var existsStaff = false;
        var existsUser = false;
        var keys = Object.keys(dat_a["users"]);
        if(dat_a["users"] != undefined){
          for(i = 0; i < Object.keys(dat_a["users"]).length; i++){
            if(username == keys[i]){
              existsUser = true;
            }
          }
        }
        if(dat_a["staffs"] != undefined){
          keys = Object.keys(dat_a["staffs"]);
          for(i = 0; i < Object.keys(dat_a["staffs"]).length; i++){
            if(username == keys[i]){
              existsStaff = true;
            }
          }
        }
        if(existsStaff){
          firebase.database().ref('staffs').once('value', (data) => {
            data = data.toJSON();
            if(data["s"+dat_a["staffs"][username]]["info"]["password"] == password){
              AsyncStorage.setItem("loggedIn", "true");
              AsyncStorage.setItem("user", JSON.stringify({"username":username, "password":password}));
              this.props.navigation.navigate('Home', {list:[{"name":"Anshul"}]});
              console.log("staff success")
            }
          });
        }
        else if(existsUser){
          firebase.database().ref('users').once('value', (data) => {
            data = data.toJSON();
            if(data["u"+dat_a["users"][username]]["info"]["password"] == password){
              AsyncStorage.setItem("loggedIn", "true");
              AsyncStorage.setItem("user", JSON.stringify({"username":username, "password":password}));
              //getUserData(username);
              this.props.navigation.navigate('Home', {list:[{"name":"Anshul"}]});
              console.log("user success")
            }
          });
        }
        else{
          console.log("invalid username");
        }
      }
      else{
        console.log("Failed")
      }
    });
  }

  render() {
    return (
        <View style={styles.container}>
          <KeyboardAvoidingView keyboardVerticalOffset={-scale(170, 1)} behavior={"position"} enabled>
            <DismissKeyboard>
              <View style={styles.container}>
                {/*Top*/}
                <View>
                  <Image
                    source={require("../../assets/logo.png")}
                    style={{
                      height: scale(120, 1),
                      width: scale(240, 1),
                      marginBottom: scale(40, 1)
                    }}
                  />
                </View>

                {/*Middle*/}
                <View>
                  {/*Username*/}
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={(text) => this.setState({input1:text})}
                    />

                  {/*Password*/}
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    autoCapitalize = 'none'
                    onChangeText={(text) => this.setState({input2: text})}
                    secureTextEntry={true}
                    />
                </View>

                {/*Sign Up Button*/}
                <View>
                  <TouchableOpacity style={styles.submit} onPress={this.login}>
                    <Text style={styles.color1}>Log In</Text>
                  </TouchableOpacity>
                </View>

                {/*Bottom*/}
                <View>
                  {/*Log in option*/}
                  <View style={styles.row}>
                    <Text>Not a member? </Text>
                    <TouchableOpacity onPress={this.signup}>
                      <Text style={styles.color2}>Sign Up</Text>
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
    margin: scale(20, 1),
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