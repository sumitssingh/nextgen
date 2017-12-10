var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  var _ = require('underscore');
var url = 'mongodb://107.170.218.205:27017/panoProd';

// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//   insertDocuments(db, function() {
//   db.close();
// });
// });  
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
            }MongoClient.connect(url, function(err, db) {
              assert.equal(null, err);
              console.log("Connected successfully to server");
              // insertDocuments(db, function() {
              // db.close();
            // });
            // });
            _.forEach(recordset.recordset, function(data) {
                var appointment  = [];
                var appointmenTime = data.working_date + ' ' + data.begintime;
                appointment.push({'appointmenTime': appointmenTime, 'location': data.Location})
                    var collection = db.collection('doctors');
                         collection.insert({username:data.description,[{Appointment:appointmenTime}]}, function(err, result) {
                        //collection.insert({username:'sumit'}, function(err, result) {
                            if (err) {
                                console.log(err)
                            }else {
                                console.log(result);
                            }
                        })
                })
            db.close();
            });


        });
    });

