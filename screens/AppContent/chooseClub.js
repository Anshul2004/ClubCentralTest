import React from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableWithoutFeedback, Keyboard, Alert, TouchableOpacity, KeyboardAvoidingView, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import scale from '../../utils/scale'
import * as firebase from 'firebase'
import addMember from "../../utils/addMember"

var clubData = [];
var recievedData = false;
getClubs()

var temp = {};
AsyncStorage.getItem("user").then((value) => {
  temp = JSON.parse(value);
  if(temp == null){
    temp = {};
  }
}).done();

export default class Choose extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        clubData:[]
    };
  }

  getInitialState(){
    return { };
  }

  render() {
      return (
        <View style={styles.container}>
        <ScrollView style={[{width: Dimensions.get("window").width, marginTop:scale(30, 1)}]}>
        {
            clubData.map((l) => (
              <View style={[styles.card]}>
                <View style={styles.row}>
                  <View style={[{marginRight:scale(0, 1)}]}>
                    <Text style={styles.title}>{l["name"]}</Text>
                    <Text style={styles.description}>{l["description"]}</Text>
                  </View>
                </View>
                <Image
								  source={require(`../../assets/img1.jpg`)}
								  style={{
                    width: scale(225, 1),
                    height: scale(150, 1)
								  }}
							  />
                <TouchableOpacity style={styles.button} onPress={() => {
                  firebase.database().ref('info').once('value', (data) => {
                    data = data.toJSON();
                      firebase.database().ref('users/u'+data["users"][temp["username"]]).once('value', (dat_a) => {
                        dat_a = dat_a.toJSON()
                        if(dat_a["clubs"] != undefined){
                          var exists = false;
                          for(i = 0; i < Object.keys(dat_a["clubs"]["member"]).length; i++){
                            if(dat_a["clubs"]["member"]["c"+(i+1)] == data["clubs"][l["name"]]){
                              exists = true;
                            }
                          }
                          if(exists == false){
                            addMember(temp["username"], l["name"])
                          }
                          else{
                            Alert.alert(
                              "Can't Join",
                              'You are already part of this club',
                              [
                                {text: 'OK', onPress: () => console.log('OK Pressed')},
                              ],
                              {cancelable: false},
                            );
                          }
                        }
                        else{
                          addMember(temp["username"], l["name"])
                        }
                      });
                  });
                }}>
                  <Text>Join</Text>
                </TouchableOpacity>
              </View>
            ))
        }
        </ScrollView>
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
  title: {
    fontSize: scale(20, 1)
  },
  description: {
    fontSize: scale(15, 1),
    margin: scale(20, 1),
    marginLeft: scale(0, 0),
    lineHeight: scale(25, 1),
    fontWeight: "100"
  },
  card: {
    backgroundColor: "white",
    padding: scale(35, 1),
    borderRadius: 10,
    margin: scale(40, 1),
    marginBottom: scale(10, 1)
  },
  signup: {
    fontSize: scale(40, 1)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    borderColor: "#474747",
    borderWidth: 1,
    borderRadius: 5,
    width: scale(50, 1),
    padding: scale(10, 1),
    fontSize: scale(15, 1),
    marginTop: scale(30, 1)
  }
});

function getClubs(){
    firebase.database().ref('info/clubs').once('value', (data) => {
        data = data.toJSON();
        keys = Object.keys(data);
        firebase.database().ref('clubs').once('value', (dat_a) => {
            clubData = []
            dat_a = dat_a.toJSON();
            for(i = 0; i < keys.length; i++){
                clubData.push(dat_a["c"+data[keys[i]]])
            }
            recievedData = true;
        });
    });
}