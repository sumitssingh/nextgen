var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db.close();
});
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
            _.forEach(recordset.recordset, function(data) {
                var appointment  = [];
                var appointmenTime = data.working_date + ' ' + data.begintime;
                appointment.push({'appointmenTime': appointmenTime, 'location': data.Location})
                var insertDocuments = function(db, callback) {
                    var collection = db.collection('doctors');
                        collection.insert({username:data.description,Appointment:appointmenTime}, function(err, result) {
                            if (err) {
                                console.log(err)
                            }else {
                                console.log(success);
                            }
                        })
                    }    
            });

            
        });
    });
