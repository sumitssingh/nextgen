var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  var _ = require('underscore');
var url = 'mongodb://107.170.218.205:27017/panoProd3';

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
            // _.forEach(recordset, function(data) {
                var newData = [];
                var data = recordset;
                // console.log(data.recordset[0].description);
                // console.log(newData[0]);
                for (var i =0; i<data.recordset.length;i++) {
                    var appointment  = [];
                    var appointmenTime = data.recordset[i].working_date + ' ' + data.recordset[i].begintime;
                    appointment.push({'appointmenTime': appointmenTime, 'location': data.Location})
                    newData.push({"username":data.recordset[i].description,"Appointment":appointment});
                    // newData[i].Appointment.push({'appointmenTime': data.recordset[i].working_date + ' ' + data.recordset[i].begintime, 'location': data.recordset[i].Location})
                    data.recordset.splice(i,1);

                    for (var j= i+1;j<data.recordset.length;j++) {
                        // console.log(data.recordset[j].working_date);
                        if (data.recordset[j].description === newData[i].username) {
                            newData[i].Appointment.push({'appointmenTime': data.recordset[j].working_date + ' ' + data.recordset[j].begintime, 'location': data.recordset[j].Location});
                            data.recordset.splice[j,1];
                        }
                    }
                }
console.log(newData);
                // var appointment  = [];
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

        });
    });
})
