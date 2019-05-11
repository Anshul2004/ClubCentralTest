import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import scale from '../utils/scale'

export default class SignUp extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {/*Username*/}
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => this.setState(text)}
          />

        {/*Password*/}
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => this.setState(text)}
          />
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
    fontWeight: '100'
  },
  bold: {
      fontWeight: '100'
  },
  input: {
    borderColor: "#474747",
    borderWidth: scale(2, 0),
    padding: scale(15, 0),
    width: scale(250, 0)
  }
});