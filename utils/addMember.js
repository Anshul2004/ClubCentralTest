import * as firebase from 'firebase'
import { AsyncStorage } from 'react-native';

export default function addMember(username, club){
    firebase.database().ref('info').once('value', (data) => {
      data = data.toJSON();
      var length = Object.keys(data["users"]).length;
      if(length > 0){
        if(data["users"][username] != undefined){
          length = Object.keys(data["clubs"]).length;
          if(length > 0){
            if(data["clubs"][club] != undefined){
              firebase.database().ref('users').once('value', (d_ata) => {
                d_ata = d_ata.toJSON();
                if(Object.keys(d_ata["u"+data["users"][username]]).length <= 2 || d_ata["u"+data["users"][username]]["clubs"] == undefined){
                  d_at_a__ = {};
                  d_at_a__["c1"] = data["clubs"][club];
                  firebase.database().ref('users/u'+ data["users"][username] +'/clubs/member').set(d_at_a__);
                  firebase.database().ref('users/u'+ data["users"][username] +'/count/clubs/member').set(1);
                }
                else{
                  d_ata["u"+data["users"][username]]["clubs"]["member"]["c"+(Object.keys(d_ata["u"+data["users"][username]]["clubs"]["member"]).length+1)] = data["clubs"][club];
                  firebase.database().ref('users/u'+ data["users"][username] +'/clubs/member').set(d_ata["u"+data["users"][username]]["clubs"]["member"]);
                  let data__ = d_ata["u"+data["users"][username]]["count"]["clubs"]["member"] + 1
                  firebase.database().ref('users/u'+ data["users"][username] +'/count/clubs/member').set(data__);
                }
                firebase.database().ref('clubs').once('value', (_d_ata) => {
                  _d_ata = _d_ata.toJSON();
                  firebase.database().ref('clubs/c'+ data["clubs"][club] +'/count/members').set(_d_ata['c'+data["clubs"][club]]["count"]["members"]+1);
                  dataDict = _d_ata["c"+data["clubs"][club]]["members"];
                  dataDict["m"+(Object.keys(_d_ata["c"+data["clubs"][club]]["members"]).length+1)] = data["users"][username];
                  firebase.database().ref('clubs/c'+ data["clubs"][club] +'/members').set(dataDict);
                  getUserData();
                });
              });
            }
          }
        }
      }
    });
  }

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