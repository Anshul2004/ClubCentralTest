import * as firebase from 'firebase'

//Database Configuration
import firebaseConfig from '../private/databaseConfig'
firebase.initializeApp(firebaseConfig)

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

//writeUserData('TestAnshul', "test@gmail,com", "user", "test", "test", "test", "test", "test")
//writeUserData('TestAnshul', "test@gmail,com", "staff", "test", "test", "test", "test", "test")
//writeUserData('Test2Anshul', "test2@gmail,com", "staff", "test2", "test2", "test2", "test2", "test2")
//writeUserData('Test2Anshul', "test2@gmail,com", "user", "test2", "test2", "test2", "test2", "test2")

function writeClubData(advisors, officers, description, name){
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
                if(dat_a["s"+temp]["count"]["clubs"] != undefined){
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

//writeClubData([{"firstName":"test", "lastName":"test"}], [{"firstName":"test", "lastName":"test"}], "A fun club since Anshul is the best!", "TestClub")
//writeClubData([{"firstName":"test", "lastName":"test"}], [{"firstName":"test", "lastName":"test"}], "A fun club since Anshul is the best!", "TestClub2")

function addMember(username, club){
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
              if(Object.keys(d_ata["u"+data["users"][username]]).length <= 2 || Object.keys(d_ata["u"+data["users"][username]]["clubs"]).length < 2){
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
              });
            });
          }
        }
      }
    }
  });
}

//addMember("Test2Anshul", "TestClub")

function addOfficer(username, club){
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
              if(Object.keys(d_ata["u"+data["users"][username]]).length <= 2 || Object.keys(d_ata["u"+data["users"][username]]["clubs"]).length < 2){
                d_at_a__ = {};
                d_at_a__["c1"] = data["clubs"][club];
                firebase.database().ref('users/u'+ data["users"][username] +'/clubs/officer').set(d_at_a__);
                firebase.database().ref('users/u'+ data["users"][username] +'/count/clubs/officer').set(1);
              }
              else{
                d_ata["u"+data["users"][username]]["clubs"]["officer"]["c"+(Object.keys(d_ata["u"+data["users"][username]]["clubs"]["officer"]).length+1)] = data["clubs"][club];
                firebase.database().ref('users/u'+ data["users"][username] +'/clubs/officer').set(d_ata["u"+data["users"][username]]["clubs"]["officer"]);
                let data__ = d_ata["u"+data["users"][username]]["count"]["clubs"]["officer"] + 1
                firebase.database().ref('users/u'+ data["users"][username] +'/count/clubs/officer').set(data__);
              }
              firebase.database().ref('clubs').once('value', (_d_ata) => {
                _d_ata = _d_ata.toJSON();
                firebase.database().ref('clubs/c'+ data["clubs"][club] +'/count/officers').set(_d_ata['c'+data["clubs"][club]]["count"]["officers"]+1);
                dataDict = _d_ata["c"+data["clubs"][club]]["officers"];
                dataDict["o"+(Object.keys(_d_ata["c"+data["clubs"][club]]["officers"]).length+1)] = data["users"][username];
                firebase.database().ref('clubs/c'+ data["clubs"][club] +'/officers').set(dataDict);
                firebase.database().ref('users').once('value', (d_ata) => {
                  d_ata = d_ata.toJSON();
                  if(Object.keys(d_ata["u"+data["users"][username]]["clubs"]).length == 2){
                    var exists = false;
                    for(k = 0; k < Object.keys(d_ata["u"+data["users"][username]]["clubs"]["member"]).length; k++){
                      if(d_ata["u"+data["users"][username]]["clubs"]["member"]["c"+(k+1)] == data["clubs"][club]){
                        exists = true;
                      }
                    }
                    if(exists == false){
                      addMember(username, club);
                    }
                  }
                  else{
                    addMember(username, club);
                  }
                });
              });
            });
          }
        }
      }
    }
  });
}

//addOfficer("Test2Anshul", "TestClub")

function addAdvisor(username, club){
  firebase.database().ref('info').once('value', (data) => {
    data = data.toJSON();
    var length = Object.keys(data["staffs"]).length;
    if(length > 0){
      if(data["staffs"][username] != undefined){
        length = Object.keys(data["clubs"]).length;
        if(length > 0){
          if(data["clubs"][club] != undefined){
            firebase.database().ref('staffs').once('value', (d_ata) => {
              d_ata = d_ata.toJSON();
              if(Object.keys(d_ata["s"+data["staffs"][username]]).length <= 2 || Object.keys(d_ata["s"+data["staffs"][username]]["clubs"]).length < 1){
                d_at_a__ = {};
                d_at_a__["c1"] = data["clubs"][club];
                firebase.database().ref('staffs/s'+ data["staffs"][username] +'/clubs').set(d_at_a__);
                firebase.database().ref('staffs/s'+ data["staffs"][username] +'/count/clubs').set(1);
              }
              else{
                d_ata["s"+data["staffs"][username]]["clubs"]["c"+(Object.keys(d_ata["s"+data["staffs"][username]]["clubs"]).length+1)] = data["clubs"][club];
                firebase.database().ref('staffs/s'+ data["staffs"][username] +'/clubs').set(d_ata["s"+data["staffs"][username]]["clubs"]);
                let data__ = d_ata["s"+data["staffs"][username]]["count"]["clubs"]+1
                firebase.database().ref('staffs/s'+ data["staffs"][username] +'/count/clubs').set(data__);
              }
              firebase.database().ref('clubs').once('value', (_d_ata) => {
                _d_ata = _d_ata.toJSON();
                dataDict = _d_ata["c"+data["clubs"][club]]["advisors"];
                dataDict["a"+(Object.keys(_d_ata["c"+data["clubs"][club]]["advisors"]).length+1)] = data["staffs"][username];
                firebase.database().ref('clubs/c'+ data["clubs"][club] +'/advisors').set(dataDict);
                firebase.database().ref('clubs/c'+data["clubs"][club]+'/count/advisors').set(Object.keys(_d_ata["c"+data["clubs"][club]]["advisors"]).length);
              });
            });
          }
        }
      }
    }
  });
}

//addAdvisor("TestAnshul", "TestClub")

function removeMember(username, club){
  firebase.database().ref('info').once('value', (data) => {
    data = data.toJSON();
    firebase.database().ref('users').once('value', (dat_a) => {
      dat_a = dat_a.toJSON();
      var userData = dat_a["u"+data["users"][username]];
      if(Object.keys(userData["clubs"]["member"]).length > 1){
        var new_dict = {};
        var temp_dict = {};
        for(i = 0; i < Object.keys(userData["clubs"]["member"]).length; i++){
          if(userData["clubs"]["member"]["c"+(i+1)] == data["clubs"][club]){
            delete userData["clubs"]["member"]["c"+(i+1)];
            new_dict = userData["clubs"]["member"];
            for(j = 0; j < Object.keys(new_dict).length; j++){
              if(new_dict["c"+(j+1)] == undefined){
                new_dict["c"+(j+1)] = new_dict["c"+(j+2)];
                if(j == Object.keys(new_dict).length-1){
                  delete new_dict["c"+(j+2)];
                }
                else {
                  new_dict["c"+(j+2)] = undefined;
                }
              }
            }
            for(j = 0; j < Object.keys(new_dict).length; j++){
              if(new_dict["c"+(j+1)] != undefined){
                temp_dict["c"+(j+1)] = new_dict["c"+(j+1)]
              }
            }
          }
          firebase.database().ref('users/u'+data["users"][username]+'/clubs/member').set(temp_dict);
        }
        firebase.database().ref('users/u'+data["users"][username]+'/count/clubs/member').set(userData["count"]["clubs"]["member"]-1);
      }
      else if(userData["clubs"]["member"]["c1"] == data["clubs"][club]){
        firebase.database().ref('users/u'+data["users"][username]+'/clubs').remove();
        firebase.database().ref('users/u'+data["users"][username]+'/count').remove();
      }
      firebase.database().ref('users').once('value', (__dat_a) => {
        __dat_a = __dat_a.toJSON();
        userData = __dat_a["u"+data["users"][username]]
        if(__dat_a["u"+data["users"][username]]["count"]!= undefined && Object.keys(userData["clubs"]["officer"]).length > 1){
          var new_dict = {};
          var temp_dict = {};
          for(i = 0; i < Object.keys(userData["clubs"]["officer"]).length; i++){
            if(userData["clubs"]["officer"]["c"+(i+1)] == data["clubs"][club]){
              delete userData["clubs"]["officer"]["c"+(i+1)];
              new_dict = userData["clubs"]["officer"];
              for(j = 0; j < Object.keys(new_dict).length; j++){
                if(new_dict["c"+(j+1)] == undefined){
                  new_dict["c"+(j+1)] = new_dict["c"+(j+2)];
                  if(j == Object.keys(new_dict).length-1){
                    delete new_dict["c"+(j+2)];
                  }
                  else {
                    new_dict["c"+(j+2)] = undefined;
                  }
                }
              }
              for(j = 0; j < Object.keys(new_dict).length; j++){
                if(new_dict["c"+(j+1)] != undefined){
                  temp_dict["c"+(j+1)] = new_dict["c"+(j+1)]
                }
              }
            }
            firebase.database().ref('users/u'+data["users"][username]+'/clubs/officer').set(temp_dict);
          }
          firebase.database().ref('users/u'+data["users"][username]+'/count/clubs/officer').set(userData["count"]["clubs"]["officer"]-1);
        }
        else if(__dat_a["u"+data["users"][username]]["count"] != undefined && userData["clubs"]["officer"]["c1"] == data["clubs"][club]){
          firebase.database().ref('users/u'+data["users"][username]+'/clubs/officer').remove();
          firebase.database().ref('users/u'+data["users"][username]+'/count/officer').remove();
        }
        firebase.database().ref('clubs/c'+data["clubs"][club]).once('value', (d__at_a) => {
          d__at_a = d__at_a.toJSON();
          var new_dict = {};
          var temp_dict = {};
          if(__dat_a["u"+data["users"][username]]["count"] != undefined){
            for(i = 0; i < Object.keys(d__at_a["members"]).length; i++){
              if(d__at_a["members"]["m"+(i+1)] == data["users"][username]){
                delete d__at_a["members"]["m"+(i+1)];
                new_dict = d__at_a["members"];
                for(j = 0; j < Object.keys(new_dict).length; j++){
                  if(new_dict["m"+(j+1)] == undefined){
                    new_dict["m"+(j+1)] = new_dict["m"+(j+2)];
                    if(j == Object.keys(new_dict).length-1){
                      delete new_dict["m"+(j+2)];
                    }
                    else {
                      new_dict["m"+(j+2)] = undefined;
                    }
                  }
                }
                for(j = 0; j < Object.keys(new_dict).length; j++){
                  if(new_dict["m"+(j+1)] != undefined){
                    temp_dict["m"+(j+1)] = new_dict["m"+(j+1)]
                  }
                }
              }
              firebase.database().ref('clubs/c'+data["clubs"][club]+'/members').set(temp_dict);
            }
            firebase.database().ref('clubs/c'+data["clubs"][club]+'/count/members').set(d__at_a["count"]["members"]-1);
          }
          var new_dict = {};
          var temp_dict = {};
          var wasOfficer = false;
          if(__dat_a["u"+data["users"][username]]["count"] != undefined){
            for(i = 0; i < Object.keys(d__at_a["officers"]).length; i++){
              if(d__at_a["officers"]["o"+(i+1)] == data["users"][username]){
                delete d__at_a["officers"]["o"+(i+1)];
                new_dict = d__at_a["officers"];
                for(j = 0; j < Object.keys(new_dict).length; j++){
                  if(new_dict["o"+(j+1)] == undefined){
                    new_dict["o"+(j+1)] = new_dict["o"+(j+2)];
                    if(j == Object.keys(new_dict).length-1){
                      delete new_dict["o"+(j+2)];
                    }
                    else {
                      new_dict["o"+(j+2)] = undefined;
                    }
                  }
                }
                for(j = 0; j < Object.keys(new_dict).length; j++){
                  if(new_dict["o"+(j+1)] != undefined){
                    temp_dict["o"+(j+1)] = new_dict["o"+(j+1)]
                  }
                }
              }
              if(Object.keys(temp_dict).length < Object.keys(d__at_a["officers"]).length){
                wasOfficer = true;
              }
              firebase.database().ref('clubs/c'+data["clubs"][club]+'/officers').set(temp_dict);
            }
          }
          if(wasOfficer){
            firebase.database().ref('clubs/c'+data["clubs"][club]+'/count/officers').set(d__at_a["count"]["officers"]-1);
          }
        });
      });
    });
  });
}

//removeMember("Test2Anshul", "TestClub2");

function removeOfficer(username, club){
  firebase.database().ref('info').once('value', (data) => {
    data = data.toJSON();
    firebase.database().ref('users').once('value', (dat_a) => {
      dat_a = dat_a.toJSON();
      var userData = dat_a["u"+data["users"][username]];
      if(Object.keys(userData["clubs"]["officer"]).length > 1){
        var new_dict = {};
        var temp_dict = {};
        for(i = 0; i < Object.keys(userData["clubs"]["officer"]).length; i++){
          if(userData["clubs"]["officer"]["c"+(i+1)] == data["clubs"][club]){
            delete userData["clubs"]["officer"]["c"+(i+1)];
            new_dict = userData["clubs"]["officer"];
            for(j = 0; j < Object.keys(new_dict).length; j++){
              if(new_dict["c"+(j+1)] == undefined){
                new_dict["c"+(j+1)] = new_dict["c"+(j+2)];
                if(j == Object.keys(new_dict).length-1){
                  delete new_dict["c"+(j+2)];
                }
                else {
                  new_dict["c"+(j+2)] = undefined;
                }
              }
            }
            for(j = 0; j < Object.keys(new_dict).length; j++){
              if(new_dict["c"+(j+1)] != undefined){
                temp_dict["c"+(j+1)] = new_dict["c"+(j+1)]
              }
            }
          }
          firebase.database().ref('users/u'+data["users"][username]+'/clubs/officer').set(temp_dict);
        }
      }
      else if(userData["clubs"]["officer"]["c1"] == data["clubs"][club]){
        firebase.database().ref('users/u'+data["users"][username]+'/clubs/officer').remove();
        firebase.database().ref('users/u'+data["users"][username]+'/count/clubs/officer').remove();
      }
      firebase.database().ref('clubs/c'+data["clubs"][club]).once('value', (d__at_a) => {
        d__at_a = d__at_a.toJSON();
        var new_dict = {};
        var temp_dict = {};
        var wasOfficer = false;
        for(i = 0; i < Object.keys(d__at_a["officers"]).length; i++){
          if(d__at_a["officers"]["o"+(i+1)] == data["users"][username]){
            delete d__at_a["officers"]["o"+(i+1)];
            new_dict = d__at_a["officers"];
            for(j = 0; j < Object.keys(new_dict).length; j++){
              if(new_dict["o"+(j+1)] == undefined){
                new_dict["o"+(j+1)] = new_dict["o"+(j+2)];
                if(j == Object.keys(new_dict).length-1){
                  delete new_dict["o"+(j+2)];
                }
                else {
                  new_dict["o"+(j+2)] = undefined;
                }
              }
            }
            for(j = 0; j < Object.keys(new_dict).length; j++){
              if(new_dict["o"+(j+1)] != undefined){
                temp_dict["o"+(j+1)] = new_dict["o"+(j+1)]
              }
            }
          }
          if(Object.keys(temp_dict).length < Object.keys(d__at_a["officers"]).length){
            wasOfficer = true;
          }
          firebase.database().ref('clubs/c'+data["clubs"][club]+'/officers').set(temp_dict);
        }
        if(wasOfficer){
          firebase.database().ref('clubs/c'+data["clubs"][club]+'/count/officers').set(d__at_a["count"]["officers"]-1);
        }
      });
    });
  });
}

//removeOfficer("Test2Anshul", "TestClub2");

function removeAdvisor(username, club){
  firebase.database().ref('info').once('value', (data) => {
    data = data.toJSON();
    firebase.database().ref('staffs').once('value', (dat_a) => {
      dat_a = dat_a.toJSON();
      var userData = dat_a["s"+data["staffs"][username]];
      if(Object.keys(userData["clubs"]).length > 1){
        var new_dict = {};
        var temp_dict = {};
        for(i = 0; i < Object.keys(userData["clubs"]).length; i++){
          if(userData["clubs"]["c"+(i+1)] == data["clubs"][club]){
            delete userData["clubs"]["c"+(i+1)];
            new_dict = userData["clubs"];
            for(j = 0; j < Object.keys(new_dict).length; j++){
              if(new_dict["c"+(j+1)] == undefined){
                new_dict["c"+(j+1)] = new_dict["c"+(j+2)];
                if(j == Object.keys(new_dict).length-1){
                  delete new_dict["c"+(j+2)];
                }
                else {
                  new_dict["c"+(j+2)] = undefined;
                }
              }
            }
            for(j = 0; j < Object.keys(new_dict).length; j++){
              if(new_dict["c"+(j+1)] != undefined){
                temp_dict["c"+(j+1)] = new_dict["c"+(j+1)]
              }
            }
          }
          firebase.database().ref('staffs/s'+data["staffs"][username]+'/clubs').set(temp_dict);
        }
        firebase.database().ref('staffs/s'+data["staffs"][username]+'/count/clubs').set(dat_a["s"+data["staffs"][username]]["count"]["clubs"]-1);
      }
      else if(userData["clubs"]["c1"] == data["clubs"][club]){
        firebase.database().ref('staffs/s'+data["users"][username]+'/clubs').remove();
        firebase.database().ref('staffs/s'+data["users"][username]+'/count').remove();
      }
      firebase.database().ref('clubs/c'+data["clubs"][club]).once('value', (d__at_a) => {
        d__at_a = d__at_a.toJSON();
        var new_dict = {};
        var temp_dict = {};
        var wasAdvisor = false;
        for(i = 0; i < Object.keys(d__at_a["advisors"]).length; i++){
          if(d__at_a["advisors"]["a"+(i+1)] == data["staffs"][username]){
            delete d__at_a["advisors"]["a"+(i+1)];
            new_dict = d__at_a["advisors"];
            for(j = 0; j < Object.keys(new_dict).length; j++){
              if(new_dict["a"+(j+1)] == undefined){
                new_dict["a"+(j+1)] = new_dict["a"+(j+2)];
                if(j == Object.keys(new_dict).length-1){
                  delete new_dict["a"+(j+2)];
                }
                else {
                  new_dict["a"+(j+2)] = undefined;
                }
              }
            }
            for(j = 0; j < Object.keys(new_dict).length; j++){
              if(new_dict["a"+(j+1)] != undefined){
                temp_dict["a"+(j+1)] = new_dict["a"+(j+1)]
              }
            }
          }
          if(Object.keys(temp_dict).length < Object.keys(d__at_a["advisors"]).length){
            wasAdvisor = true;
          }
          firebase.database().ref('clubs/c'+data["clubs"][club]+'/advisors').set(temp_dict);
        }
        if(wasAdvisor){
          firebase.database().ref('clubs/c'+data["clubs"][club]+'/count/advisors').set(d__at_a["count"]["advisors"]-1);
        }
      });
    });
  });
}

//removeAdvisor("TestAnshul", "TestClub");