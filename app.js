var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  var _ = require('underscore');
var url = 'mongodb://107.170.218.205:27017/panoProd3';

    var sql = require("mssql");;
    var config = {
        user: 'svc_oncall',
        password: 'gOGJhG6K1w',
        server: 'xposc-nextgen01', 
        database: 'NGProd'
    };
    sql.connect(config, function (err) {
    
        if (err) console.log('err '+err);
        var request = new sql.Request();
           console.log("connected");
           request.query("select * from viewDrCardCategories where working_date='20091023' union select * from viewDrCardClinicLocations where working_date='20091023' union select * from viewDrCardAppointments where working_date='20091023' order by description, begintime", function (err, recordset) {
            if (err)  {
                console.log(err)
            }
            MongoClient.connect(url, function(err, db) {
              assert.equal(null, err);
              console.log("Connected successfully to server");
                var event = recordset;
                request.query("select distinct description from viewDrCardCategories", function (err, data) {
                    if (err) {
                        console.log(err)
                    }
                    var newData = [];
                for (var i =0; i<data.recordset.length-1;i++) {
                    newData.push({"username":data.recordset[i].description,"Appointment":[]});
                    for (var j= 0;j<event.recordset.length-1;j++) {
                        if (event.recordset[j].description === data.recordset[i].description) {
                            newData[i].Appointment.push({'appointmenTime': event.recordset[j].working_date + ' ' + event.recordset[j].begintime, 'location': event.recordset[j].Location})
                        }
                    }
                }
                _.forEach(newData,function(list) {
                        var collection = db.collection('doctors');
                                collection.insert({"username":list.username,"Appointment":list.Appointment}, function(err, result) {
                            if (err) {
                                console.log(err)
                            }else {
                                console.log(result);
                            }
                        })
                })
                db.close();
            })
        })        
    })   
})             // var appointment  = [];
                // var appointmenTime = data.working_date + ' ' + data.begintime;
                // appointment.push({'appointmenTime': appointmenTime, 'location': data.Location})
                //     var collection = db.collection('doctors');
                //          collection.insert({"username":data.description,"Appointment":appointment}, function(err, result) {
                //             if (err) {
                //                 console.log(err)
                //             }else {
                //                 console.log(result);
                //             }
                //         })
                //          db.close();
                
        //         request.query("select distinct description from viewDrCardCategories", function (err, data) {
        //                 if (err) {
        //                     console.log(err)
        //                 } else {
        //                     for (var i = data.length - 1; i >= 0; i--) {

        //                     var collection = db.collection('doctors');
        //                     collection.find({username:data.description}, function(err, doc){
        //                         _.forEach(doc, function(data){
        //                             var appointment  = [];
        //                             appointment = data.Appointment;
        //                             collection.insert({"username":doc.username+1,"Appointment":appointment}, function(err, result) {
        //                             if (err) {
        //                                 console.log(err)
        //                             }else {
        //                                 console.log(result);
        //                             }
        //                         })
        //                     })
        //                 })
        //             }
        //     db.close();
        //     }
        // })
// console.log(newData);
// 
        // });
            // })
    // });



