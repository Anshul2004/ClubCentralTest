import { createStackNavigator, createAppContainer } from 'react-navigation';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image, KeyboardAvoidingView, AsyncStorage, Alert } from 'react-native';
import * as firebase from 'firebase'

//Enter app pages
import SignUp from './screens/EnterApp/signUp'
import SignUp2 from './screens/EnterApp/signUp2'
import LogIn from './screens/EnterApp/logIn'

//Content pages
import Home from './screens/AppContent/home'

import firebaseConfig from './private/databaseConfig'
import writeClubData from './utils/writeClubData';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

//writeUserData("anshuluser", "cyberblaze2004@gmail,com", "user", "anshul", "Anshul", "Kashyap", "Dublin High School", "9");
//writeClubData([{"firstName":"Anshul", "lastName":"Kashyap"}], [{"firstName":"Anshul", "lastName":"Kashyap"}], "A fun club where students who share a passion for engineering can come together and have fun!", "Gael Force Robotics");

console.disableYellowBox = true;

const container = createStackNavigator({
    SignUp: { screen: SignUp,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    SignUp2: { screen: SignUp2,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    LogIn: { screen: LogIn,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    Home: { screen: Home,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
  },
  {
    initialRouteName: 'SignUp'
});

export default createAppContainer(container)

/*
App style info
Color Pallete:
    Background color
  -#efefef
    Primary text color
  -#474747
    Button color
  -#e8da1b
    Secondary text color
  -#ffffff
*/

getUserData();
getOfficerData();

var userData = [];

function getUserData(){
  AsyncStorage.getItem("user").then((value) => {
    temp__ = JSON.parse(value);
    firebase.database().ref('info').once('value', (data) => {
      data = data.toJSON();
      if(temp__ != null){
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
      }
    });
  }).done();
}

function getOfficerData(){
  AsyncStorage.getItem("user").then((value) => {
    temp__ = JSON.parse(value);
    firebase.database().ref('info').once('value', (data) => {
      data = data.toJSON();
      if(temp__ != null){
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
      }
  });
  }).done();
}