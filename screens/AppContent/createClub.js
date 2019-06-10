import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, Dimensions, TouchableOpacity, Image, KeyboardAvoidingView, AsyncStorage, ScrollView } from 'react-native';
import scale from '../../utils/scale'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import tabBarIcon from '../../utils/tabBarIcon'
import Choose from "./chooseClub"
import writeClubData from "../../utils/writeClubData"
var clubData = require("./staticContent").clubData;

//writeClubData([{"firstName":"Adam", "lastName":"Brown"}], [{"firstName":"eugene", "lastName":"chou"}], "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "TestClub2");

const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
	  {children}
	</TouchableWithoutFeedback>
);

export default class Club extends React.Component {
    constructor(props) {
		super(props)
		this.state = {
      //Advisor First Name
      input1:"",
      //Advisor Last Name
      input2:"",
      //Officer First Name
      input3:"",
      //Officer Last Name
      input4:"",
      //Description
      input5:"",
      //Club Name
      input6:"",
    };
  }

  signout = () => {
    AsyncStorage.setItem("loggedIn", "false");
    AsyncStorage.setItem("userData", JSON.stringify({}));
    this.props.navigation.navigate('LogIn');
  }

  getInitialState(){
    return { };
  }

  create = () => {
    writeClubData([{"firstName":this.state.input1, "lastName":this.state.input2}], [{"firstName":this.state.input3, "lastName":this.state.input4}], this.state.input6, this.state.input5);
    clubData.push({"name":this.state.input5, "description":this.state.input6})
  }

  render() {
    const { navigation } = this.props;
    return (
        <DismissKeyboard>
        <View style={styles.container}>
        <KeyboardAvoidingView keyboardVerticalOffset={-scale(120, 1)} behavior={"position"} enabled>
        <TouchableOpacity style={styles.button2} onPress={this.signout}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        <View style={[styles.container, {marginTop:scale(0, 1)}]}>
            <View>
                <Text style={styles.title}>Advisor Info:</Text>
                <View style={styles.row}>
                    <TextInput
                      style={styles.inputHalf}
                      placeholder="First Name"
                      onChangeText={(text) => this.setState({input1:text})}
                      />
                      <TextInput
                      style={styles.inputHalf}
                      placeholder="Last Name"
                      onChangeText={(text) => this.setState({input2:text})}
                      />
                    </View>
            </View>
            <View>
                <Text style={styles.title}>Officer Info:</Text>
                <View style={styles.row}>
                    <TextInput
                      style={styles.inputHalf}
                      placeholder="First Name"
                      onChangeText={(text) => this.setState({input3:text})}
                      />
                      <TextInput
                      style={styles.inputHalf}
                      placeholder="Last Name"
                      onChangeText={(text) => this.setState({input4:text})}
                      />
                    </View>
            </View>
            <View>
            <Text style={styles.title}>Club Info:</Text>
                <View>
                    <TextInput
                      style={styles.input}
                      placeholder="Name"
                      onChangeText={(text) => this.setState({input5:text})}
                      />
                      <TextInput
                      style={[styles.input, {height: scale(100, 1)}]}
                      placeholder="Description"
                      onChangeText={(text) => this.setState({input6:text})}
                      numberOfLines = {4}
                        multiline = {true}
                      />
                    </View>
            </View>
            <TouchableOpacity onPress={this.create} style={styles.submit}>
                <Text style={styles.color1}>Create Club</Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
        </View>
        </DismissKeyboard>
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
  input: {
    borderColor: "#474747",
    borderWidth: scale(1, 0),
    padding: scale(10, 1),
    width: scale(250, 0),
    margin: scale(10, 1),
    fontSize: scale(15, 1)
  },
  inputHalf: {
    borderColor: "#474747",
    borderWidth: scale(1, 0),
    padding: scale(10, 1),
    width: scale(115, 0),
    margin: scale(10, 1),
    fontSize: scale(15, 1)
  },
  title: {
    fontSize: scale(15, 1),
    fontWeight: "100",
    margin: scale(10, 1)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  color1: {
    color: "#ffffff"
  },
  color2: {
    color: "#cec116"
  },
  submit: {
    backgroundColor: "#e8da1b",
    borderRadius: scale(15, 1),
    padding: scale(15, 1),
    margin: scale(30, 1),
    marginTop: scale(20, 1),
    marginBottom: scale(0, 1)
  },
  button2: {
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