import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, Dimensions, TouchableOpacity, Image, KeyboardAvoidingView, AsyncStorage, ScrollView } from 'react-native';
import scale from '../../utils/scale'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import tabBarIcon from '../../utils/tabBarIcon'
import Choose from "./chooseClub"
import Club from "./createClub"

var clubData = [];
    AsyncStorage.getItem("officerData").then((value) => {
      clubData = JSON.parse(value);
      console.log(clubData)
      if(clubData == null){
        clubData = [];
      }
    }).done();

export default class Stats extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        list:[]
      };
  }

  signout = () => {
    AsyncStorage.setItem("loggedIn", "false");
    AsyncStorage.setItem("userData", JSON.stringify({}));
    this.props.navigation.navigate('LogIn');
  }

  render() {
    const { navigation } = this.props;
    return (
        <View style={styles.container}>
        <ScrollView style={[{width: Dimensions.get("window").width, marginTop:scale(0, 1)}]}>
          <TouchableOpacity style={styles.button} onPress={this.signout}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        {
            clubData.map((l) => (
              <View style={[styles.card]}>
                <View style={[styles.row, {marginRight:scale(50, 1)}]}>
                  <View style={[{marginRight:scale(20, 1)}]}>
                    <Text style={[styles.title, {marginRight:scale(50, 1)}]}>{l["name"]}</Text>
                    <Text style={[styles.description, {marginLeft:scale(20, 1)}]}>Advisors: {l["count"]["advisors"]}</Text>
                    <Text style={[styles.description, {marginLeft:scale(20, 1)}]}>Officers: {l["count"]["officers"]}</Text>
                    <Text style={[styles.description, {marginLeft:scale(20, 1)}]}>Members: {l["count"]["members"]}</Text>
                  </View>
                </View>
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
    fontSize: scale(20, 1),
    marginBottom: scale(20, 1)
  },
  description: {
    fontSize: scale(15, 1),
    margin: scale(10, 1),
    marginLeft: scale(0, 0),
    lineHeight: scale(25, 1),
    fontWeight: "100"
  },
  card: {
    backgroundColor: "white",
    padding: scale(35, 1),
    borderRadius: 10,
    margin: scale(40, 1),
    marginBottom: scale(10, 1),
    marginTop: scale(40, 1)
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
    width: scale(80, 1),
    padding: scale(10, 1),
    fontSize: scale(15, 1),
    marginTop: scale(50, 1),
    marginLeft: scale(250, 0)
  },
  buttonText: {
    fontSize: scale(14, 1)
  }
});