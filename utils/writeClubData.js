import * as firebase from 'firebase'

//Database Configuration
import firebaseConfig from '../private/databaseConfig'
import { Alert } from 'react-native';

export default function writeClubData(advisors, officers, description, name){
    firebase.database().ref('clubs').once('value', (data) => {
      data = data.toJSON()
      if(data != undefined){
        var exists = false;
        for(i = 0; i < Object.keys(data).length; i++){
          if(data[Object.keys(data)[i]]["name"] == name){
            exists = true
          }
        }
        if(exists == false){
          var advisors_Dict = {};
          var officers_Dict = {};
          var members_Dict = {};
          var staffExists = [];
          var officerExists = []
          for(i = 0; i < advisors.length; i++){
            staffExists.push(false)
            officerExists.push(false)
          }
          firebase.database().ref('staffs').once('value', (dat_a) => {
            dat_a = dat_a.toJSON()
            for(j = 0; j < advisors.length; j++){
              for(i = 0; i < Object.keys(dat_a).length; i++){
                if(advisors[j]["firstName"]+advisors[j]["lastName"] == dat_a["s"+(i+1)]["info"]["first name"]+dat_a["s"+(i+1)]["info"]["last name"]){
                  staffExists[j] = true;
                  advisors_Dict["a" + (Object.keys(advisors_Dict).length+1)] = i+1
                }
              }
            }
            if(Object.keys(advisors_Dict).length > 0){
              firebase.database().ref("clubs/c"+(Object.keys(data).length+1)).set({
                advisors:advisors_Dict,
                description: description,
                name: name
              });
              firebase.database().ref('info/count').once('value', (data) => {
                firebase.database().ref('info/count/clubs').set(data.toJSON()["clubs"]+1)
              })
              firebase.database().ref("info/clubs/"+name).set(Object.keys(data).length+1);
  
              for(i = 0; i < Object.keys(advisors_Dict).length; i++){
                let temp = advisors_Dict["a"+(i+1)];
                firebase.database().ref('staffs/s'+advisors_Dict["a"+(i+1)]+'/clubs').once('value', (dat__a) => {
                  let length = 0;
                  let clubs_dict = {}
                  if(dat__a.toJSON() != null){
                    clubs_dict = dat__a.toJSON()
                    length = Object.keys(dat__a.toJSON()).length
                    let name = "c" + (length+1)
                    clubs_dict[name] = Object.keys(data).length+1
                    firebase.database().ref('staffs/s'+temp+'/clubs').set(clubs_dict);
                  }
                  else{
                    clubs_dict["c1"] = Object.keys(data).length+1
                    firebase.database().ref('staffs/s'+temp+'/clubs').set(clubs_dict);
                  }
                  //if(dat_a["s"+temp]["count"] != undefined){
                    if(dat_a["s"+temp]["count"]["clubs"] != undefined){
                      firebase.database().ref('staffs/s'+temp+'/count/clubs').set(dat_a["s"+temp]["count"]["clubs"] + 1);
                    }
                    else{
                      firebase.database().ref('staffs/s'+temp+'/count/clubs').set(1);
                    }
                  //}
                  //else{
                    //firebase.database().ref('staffs/s'+temp+'/count/clubs').set(1);
                  //}
                });
              }
              firebase.database().ref('users').once('value', (d_at_a) => {
                d_at_a = d_at_a.toJSON()
                for(j = 0; j < officers.length; j++){
                  for(i = 0; i < Object.keys(d_at_a).length; i++){
                    if(officers[j]["firstName"]+officers[j]["lastName"] == d_at_a["u"+(i+1)]["info"]["first name"]+d_at_a["u"+(i+1)]["info"]["last name"]){
                      officerExists[j] = true;
                      officers_Dict["o" + (Object.keys(officers_Dict).length+1)] = i+1
                      members_Dict["m" + (Object.keys(officers_Dict).length)] = i+1
                    }
                  }
                }
                firebase.database().ref('clubs/c'+(Object.keys(data).length+1)+'/officers').set(officers_Dict);
                firebase.database().ref('clubs/c'+(Object.keys(data).length+1)+'/members').set(members_Dict);
                firebase.database().ref('clubs/c'+(Object.keys(data).length+1)+'/count/officers').set(Object.keys(officers_Dict).length);
                firebase.database().ref('clubs/c'+(Object.keys(data).length+1)+'/count/members').set(Object.keys(officers_Dict).length);
                firebase.database().ref('clubs/c'+(Object.keys(data).length+1)+'/count/advisors').set(Object.keys(advisors_Dict).length);
                for(i = 0; i < Object.keys(officers_Dict).length; i++){
                  var temp = officers_Dict["o"+(i+1)];
                  if(Object.keys(d_at_a["u"+temp]).length == 1){
                    firebase.database().ref('users/u'+ temp +'/count/clubs/officer').set(1);
                    firebase.database().ref('users/u'+ temp +'/count/clubs/member').set(1);
                  }
                  else {
                    firebase.database().ref('users/u'+ temp +'/count/clubs/member').set(d_at_a["u"+temp]["count"]["clubs"]["member"]+1);
                    if(Object.keys(d_at_a["u"+temp]["count"]["clubs"]).length == 1){
                      firebase.database().ref('users/u'+ temp +'/count/clubs/officer').set(1);
                    }
                    else{
                      firebase.database().ref('users/u'+ temp +'/count/clubs/officer').set(d_at_a["u"+temp]["count"]["clubs"]["officer"]+1);
                    }
                  }
                  if(Object.keys(d_at_a["u"+temp]).length <= 2){
                    d_at_a__ = {};
                    d_at_a__["c1"] = Object.keys(data).length+1;
                    firebase.database().ref('users/u'+ temp +'/clubs/officer').set(d_at_a__);
                    firebase.database().ref('users/u'+ temp +'/clubs/member').set(d_at_a__);
                  }
                  else{
                    d_at_a["u"+temp]["clubs"]["officer"]["c"+(Object.keys(d_at_a["u"+temp]["clubs"]["officer"]).length+1)] = Object.keys(data).length+1;
                    d_at_a["u"+temp]["clubs"]["member"]["c"+(Object.keys(d_at_a["u"+temp]["clubs"]["member"]).length+1)] = Object.keys(data).length+1;
                    firebase.database().ref('users/u'+ temp +'/clubs/officer').set(d_at_a["u"+temp]["clubs"]["officer"]);
                    firebase.database().ref('users/u'+ temp +'/clubs/member').set(d_at_a["u"+temp]["clubs"]["member"]);
                  }
                }
                Alert.alert(
                  'Club Created',
                  'You have created a club',
                  [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  {cancelable: false},
                );
              });
              firebase.database().ref('info/count/clubs').set(Object.keys(data).length);
            }
          });
        }
        else{
          /*
            CLUB ALREADY EXISTS
          */
        }
      }
      else{
        var advisors_Dict = {};
        var officers_Dict = {};
        var members_Dict = {};
        var staffExists = [];
        var officerExists = []
        for(i = 0; i < advisors.length; i++){
          staffExists.push(false)
          officerExists.push(false)
        }
        firebase.database().ref('staffs').once('value', (dat_a) => {
          dat_a = dat_a.toJSON()
          for(j = 0; j < advisors.length; j++){
            for(i = 0; i < Object.keys(dat_a).length; i++){
              if(advisors[j]["firstName"]+advisors[j]["lastName"] == dat_a["s"+(i+1)]["info"]["first name"]+dat_a["s"+(i+1)]["info"]["last name"]){
                staffExists[j] = true;
                advisors_Dict["a" + (Object.keys(advisors_Dict).length+1)] = i+1
              }
            }
          }
          if(Object.keys(advisors_Dict).length > 0){
            firebase.database().ref("clubs/c1").set({
              advisors:advisors_Dict,
              description: description,
              name: name
            });
            firebase.database().ref('info/count').once('value', (data) => {
              firebase.database().ref('info/count/clubs').set(1)
            })
            firebase.database().ref("info/clubs/"+name).set(1);
  
            for(i = 0; i < Object.keys(advisors_Dict).length; i++){
              let temp = advisors_Dict["a"+(i+1)];
              firebase.database().ref('staffs/s'+advisors_Dict["a"+(i+1)]+'/clubs').once('value', (dat__a) => {
                let length = 0;
                let clubs_dict = {}
                if(dat__a.toJSON() != null){
                  clubs_dict = dat__a.toJSON()
                  length = Object.keys(dat__a.toJSON()).length
                  let name = "c" + (length+1)
                  clubs_dict[name] = 1
                  firebase.database().ref('staffs/s'+temp+'/clubs').set(clubs_dict);
                }
                else{
                  clubs_dict["c1"] = 1
                  firebase.database().ref('staffs/s'+temp+'/clubs').set(clubs_dict);
                }
                if(dat_a["s"+temp]["count"]!= undefined){
                  firebase.database().ref('staffs/s'+temp+'/count/clubs').set(dat_a["s"+temp]["count"]["clubs"] + 1);
                }
                else{
                  firebase.database().ref('staffs/s'+temp+'/count/clubs').set(1);
                }
              });
            }
            firebase.database().ref('users').once('value', (d_at_a) => {
              d_at_a = d_at_a.toJSON()
              for(j = 0; j < officers.length; j++){
                for(i = 0; i < Object.keys(d_at_a).length; i++){
                  if(officers[j]["firstName"]+officers[j]["lastName"] == d_at_a["u"+(i+1)]["info"]["first name"]+d_at_a["u"+(i+1)]["info"]["last name"]){
                    officerExists[j] = true;
                    officers_Dict["o" + (Object.keys(officers_Dict).length+1)] = i+1
                    members_Dict["m" + (Object.keys(officers_Dict).length)] = i+1
                  }
                }
              }
              firebase.database().ref('clubs/c1/officers').set(officers_Dict);
              firebase.database().ref('clubs/c1/members').set(members_Dict);
              firebase.database().ref('clubs/c1/count/officers').set(Object.keys(officers_Dict).length);
              firebase.database().ref('clubs/c1/count/members').set(Object.keys(officers_Dict).length);
              firebase.database().ref('clubs/c1/count/advisors').set(Object.keys(advisors_Dict).length);
              for(i = 0; i < Object.keys(officers_Dict).length; i++){
                var temp = officers_Dict["o"+(i+1)];
                if(Object.keys(d_at_a["u"+temp]).length == 1){
                  firebase.database().ref('users/u'+ temp +'/count/clubs/officer').set(1);
                  firebase.database().ref('users/u'+ temp +'/count/clubs/member').set(1);
                }
                else {
                  firebase.database().ref('users/u'+ temp +'/count/clubs/member').set(d_at_a["u"+temp]["count"]["clubs"]["member"]+1);
                  if(Object.keys(d_at_a["u"+temp]["count"]["clubs"]).length == 1){
                    firebase.database().ref('users/u'+ temp +'/count/clubs/officer').set(1);
                  }
                  else{
                    firebase.database().ref('users/u'+ temp +'/count/clubs/officer').set(d_at_a["u"+temp]["count"]["clubs"]["officer"]+1);
                  }
                }
                if(Object.keys(d_at_a["u"+temp]).length <= 2){
                  d_at_a__ = {};
                  d_at_a__["c1"] = 1;
                  firebase.database().ref('users/u'+ temp +'/clubs/officer').set(d_at_a__);
                  firebase.database().ref('users/u'+ temp +'/clubs/member').set(d_at_a__);
                }
                else{
                  d_at_a["u"+temp]["clubs"]["officer"]["c"+(Object.keys(d_at_a["u"+temp]["clubs"]["officer"]).length+1)] = 1;
                  d_at_a["u"+temp]["clubs"]["member"]["c"+(Object.keys(d_at_a["u"+temp]["clubs"]["member"]).length+1)] = 1;
                  firebase.database().ref('users/u'+ temp +'/clubs/officer').set(d_at_a["u"+temp]["clubs"]["officer"]);
                  firebase.database().ref('users/u'+ temp +'/clubs/member').set(d_at_a["u"+temp]["clubs"]["member"]);
                }
              }
            });
            firebase.database().ref('info/count/clubs').set(1);
          }
        });
      }
    });
  }