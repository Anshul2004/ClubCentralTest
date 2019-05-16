import * as firebase from 'firebase'

//Database Configuration
import firebaseConfig from '../private/databaseConfig'

export default function writeUserData(username, email, type, password, firstName, lastName, school, grade) {
    if(type == "staff"){
      firebase.database().ref('staffs').once('value', (dat_a) => {
        dat_a = dat_a.toJSON()
        if(dat_a != undefined){
          var exists = false;
          var length = Object.keys(dat_a).length;
          for(i = 0; i < length; i++){
            if(dat_a[Object.keys(dat_a)[i]]["info"]["first name"] + dat_a[Object.keys(dat_a)[i]]["info"]["last name"] == firstName + lastName){
              exists = true;
            }
            else if(dat_a[Object.keys(dat_a)[i]]["info"]["email"] == email){
              exists = true;
            }
            else if(dat_a[Object.keys(dat_a)[i]]["info"]["username"] == username){
              exists = true;
            }
          }
          if(exists == false){
            firebase.database().ref('staffs').once('value', (data) => {
              var length = Object.keys(data.toJSON()).length;
              firebase.database().ref('staffs/s'+(length+1)+'/info').set({
                username: username,
                email: email,
                type: type,
                password: password,
                "first name": firstName,
                "last name": lastName,
                school: school,
              });
              firebase.database().ref('info/count/staffs').set(length+1);
              firebase.database().ref('info/staff emails/'+email).set(length+1);
              firebase.database().ref('info/staffs/'+username).set(length+1);
            });
          }
          else{
            /*
              USER ALREADY EXISTS
            */
          }
        }
        else{
          firebase.database().ref('staffs/s1/info').set({
            username: username,
            email: email,
            type: type,
            password: password,
            "first name": firstName,
            "last name": lastName,
            school: school,
          });
          firebase.database().ref('info/count/staffs').set(1);
          firebase.database().ref('info/staff emails/'+email).set(1);
          firebase.database().ref('info/staffs/'+username).set(1);
        }
      });
    }
    else if(type == "user"){
      firebase.database().ref('users').once('value', (dat_a) => {
        dat_a = dat_a.toJSON()
        if(dat_a != undefined){
          var exists = false;
          var length = Object.keys(dat_a).length;
          for(i = 0; i < length; i++){
            if(dat_a[Object.keys(dat_a)[i]]["info"]["first name"] + dat_a[Object.keys(dat_a)[i]]["info"]["last name"] == firstName + lastName){
              exists = true;
            }
            else if(dat_a[Object.keys(dat_a)[i]]["info"]["email"] == email){
              exists = true;
            }
            else if(dat_a[Object.keys(dat_a)[i]]["info"]["username"] == username){
              exists = true;
            }
          }
          if(exists == false){
            firebase.database().ref('users').once('value', (data) => {
              var length = Object.keys(data.toJSON()).length;
              firebase.database().ref('users/u'+(length+1)+'/info').set({
                username: username, 
                email: email,
                type: type,
                password: password,
                "first name": firstName,
                "last name": lastName,
                school: school,
                grade: grade
              });
  
              firebase.database().ref('info/count/users').set(length+1);
              firebase.database().ref('info/emails/'+email).set(length+1);
              firebase.database().ref('info/users/'+username).set(length+1);
            });
          }
          else{
            /*
              USER ALREADY EXISTS
            */
          }
        }
        else{
          firebase.database().ref('users/u1/info').set({
            username: username, 
            email: email,
            type: type,
            password: password,
            "first name": firstName,
            "last name": lastName,
            school: school,
            grade: grade
          });
  
          firebase.database().ref('info/count/users').set(1);
          firebase.database().ref('info/emails/'+email).set(1);
          firebase.database().ref('info/users/'+username).set(1);
        }
      });
    }
  }