import * as firebase from 'firebase'

//Database Configuration
import firebaseConfig from '../private/databaseConfig'

export default function getUserData(username){
  firebase.database().ref('info').once('value', (data) => {
    data = data.toJSON();
    let userId = data["users"][username];
    firebase.database().ref('users/u'+userId).once('value', (dat_a) => {
      dat_a = dat_a.toJSON()
      return dat_a;
    });
  });
}