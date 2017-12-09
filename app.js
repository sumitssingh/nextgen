
   // var db = connect('heroku_95qwwgj8:6iuv3jlc5vkoqbfuf651agu0jv@ds023490.mlab.com:23490/heroku_95qwwgj8')
   var _ = require('underscore');
   // var mongoose = require('mongoose');
    
    // var db = connect('mongodb://107.170.218.205:27017/panoProd');
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://107.170.218.205:27017/mydb";

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      console.log("Database created!");
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
                db.collection('Docter').insert({username:data.description,Appointment:appointmenTime})
            });

            
        });
    });