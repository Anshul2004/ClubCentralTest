import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, Dimensions, TouchableOpacity, Image, KeyboardAvoidingView, AsyncStorage, ScrollView } from 'react-native';
import scale from '../../utils/scale'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import tabBarIcon from '../../utils/tabBarIcon'
import Choose from "./chooseClub"
import Club from "./createClub"

var clubData = [];
    AsyncStorage.getItem("userData").then((value) => {
      clubData = JSON.parse(value);
      if(clubData == null){
        clubData = [];
      }
    }).done();

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        list:[]
      };
  }

  getInitialState(){
    return { };
  }

  signout = () => {
    AsyncStorage.setItem("loggedIn", "false");
    this.props.navigation.navigate('SignUp');
  }

  render() {
    const { navigation } = this.props;
    return (
        <View style={styles.container}>
        <ScrollView style={[{width: Dimensions.get("window").width, marginTop:scale(0, 1)}]}>
          <TouchableOpacity style={styles.button} onPress={this.signout}>
            <Text>Sign Out</Text>
          </TouchableOpacity>
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
  }
});

export default createMaterialBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: tabBarIcon("home")
      },
    },
    Choose: {
      screen: Choose,
      navigationOptions: {
        tabBarLabel: "Clubs",
        tabBarIcon: tabBarIcon("event-note")
      },
    },
    Club: {
      screen: Club,
      navigationOptions: {
        tabBarLabel: "Create",
        tabBarIcon: tabBarIcon("edit")
      },
    },
  },
  {
    barStyle: { backgroundColor: "#f3f3f3" }
  }
)