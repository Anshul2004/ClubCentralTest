import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import scale from '../../utils/scale'
import writeUserData from "../../utils/writeUserData"
import * as firebase from 'firebase'

const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
	  {children}
	</TouchableWithoutFeedback>
);

export default class SignUp2 extends React.Component {

  constructor(props) {
	super(props)
	this.state = {
      //Password
      input3:"",
      //School
      input6:"",
      //Grade
      input7:"",
      //First
      first:"",
      //Last
      last:"",
      //Email
      email:"",
      //Username
      username:""
    };
  }
  
  login = () => {
    this.props.navigation.navigate('LogIn');
  }

  signup = () => {
    writeUserData(this.state.username, this.state.email.replace(".", ","), "user", this.state.input3, this.state.first, this.state.last, this.state.input6.toLowerCase(), this.state.input7.toLowerCase())
    AsyncStorage.setItem("loggedIn", "true");
    AsyncStorage.setItem("user", JSON.stringify({"username":this.state.username, "password":this.state.input3}));
    getUserData();
    getOfficerData();
    this.props.navigation.navigate('Home')
  }

  render() {
    const { navigation } = this.props;

    this.state.first = navigation.getParam('first', "nodata");
    this.state.last = navigation.getParam('last', "nodata");
    this.state.email = navigation.getParam('email', "nodata");
    this.state.username = navigation.getParam('username', "nodata");
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
                  {/*Password*/}
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    autoCapitalize = 'none'
                    onChangeText={(text) => this.setState({input3: text})}
                    secureTextEntry={true}
                    />

                  {/*School*/}
                  <TextInput
                    style={styles.input}
                    placeholder="School"
                    autoCapitalize = 'none'
                    onChangeText={(text) => this.setState({input6: text})}
                    />

                  {/*Grade*/}
                  <TextInput
                    style={styles.input}
                    placeholder="Grade"
                    autoCapitalize = 'none'
                    onChangeText={(text) => this.setState({input7: text})}
                    />
                </View>

                {/*Sign Up Button*/}
                <View>
                  <TouchableOpacity style={styles.submit} onPress={this.signup}>
                    <Text style={styles.color1}>Sign Up</Text>
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

function getUserData(){
  AsyncStorage.getItem("user").then((value) => {
    temp__ = JSON.parse(value);
    firebase.database().ref('info').once('value', (data) => {
      data = data.toJSON();
        firebase.database().ref('users/u'+data["users"][temp__["username"]]+"/clubs/member").once('value', (dat_a) => {
            dat_a = dat_a.toJSON();
            userData = [];
            firebase.database().ref('clubs').once('value', (d_at_a) => {
              d_at_a = d_at_a.toJSON();
              var tempList = [];
              if(dat_a != undefined){
                for(i = 0; i < Object.keys(dat_a).length; i++){
                  tempList.push(dat_a["c"+(i+1)]);
                }
                for(i = 0; i < tempList.length; i++){
                  userData.push(d_at_a["c"+tempList[i]]);
                }
              }
              AsyncStorage.setItem("userData", JSON.stringify(userData));
            });
        });
      
    });
  }).done();
}

function getOfficerData(){
  AsyncStorage.getItem("user").then((value) => {
    temp__ = JSON.parse(value);
    firebase.database().ref('info').once('value', (data) => {
      data = data.toJSON();
        firebase.database().ref('users/u'+data["users"][temp__["username"]]+"/clubs/officer").once('value', (dat_a) => {
            dat_a = dat_a.toJSON();
            userData = [];
            firebase.database().ref('clubs').once('value', (d_at_a) => {
              d_at_a = d_at_a.toJSON();
              var tempList = [];
              if(dat_a != undefined){
                for(i = 0; i < Object.keys(dat_a).length; i++){
                  tempList.push(dat_a["c"+(i+1)]);
                }
                for(i = 0; i < tempList.length; i++){
                  userData.push(d_at_a["c"+tempList[i]]);
                }
              }
              AsyncStorage.setItem("officerData", JSON.stringify(userData));
            });
        });
      
  });
  }).done();
}