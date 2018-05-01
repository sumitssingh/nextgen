
var MongoClient = require('mongodb').MongoClient
, assert = require('assert');
var _ = require('underscore');
// var url = 'mongodb://localhost:27017/panorama4';
 var url = 'mongodb://107.170.218.205:27017/panortest'
// var url = 'mongodb://localhost:27017/panoramaTest';
var sql = require("mssql");;
var config = {
  user: 'svc_oncall',
  password: 'gOGJhG6K1w',
  server: 'poscngproddb01',
  database: 'NGProd'
};
var d = new Date();
var n = d.toJSON();
var date  = n.split('T');
var date1 = date[0].split('-');
 var newDate = '20180423';
// var newDate = process.argv[2] || date1[0]+date1[1]+date1[2];
console.log('script is running for : ',newDate)

sql.connect(config, function (err) {

  if (err) console.log('err '+err);
  var request = new sql.Request();
  console.log("connected");
  request.query("select * from viewDrCardCategories where working_date="+newDate+"union select * from viewDrCardClinicLocations where working_date="+newDate+" union select * from viewDrCardAppointments where working_date="+newDate+" order by description, begintime", function (err, recordset) {

    if (err)  {
      console.log(err)
    }
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
//      console.log("Connected successfully to server. Script is Running for ",newDate);
      var event = recordset;
// console.log(event);
// db.close();
      request.query("select distinct description from viewDrCardCategories", function (err, data) {

        if (err) {
          console.log(err)
        }
        var newData = [];
        for (var i =0; i<data.recordset.length-1;i++) {
// console.log(data.recordset[i]);
          newData.push({"username":data.recordset[i].description,"Appointment":[]});
          for (var j= 0;j<event.recordset.length-1;j++) {
            if (event.recordset[j].description === data.recordset[i].description) {
              var year = event.recordset[j].working_date.slice(0,4);
              var month = event.recordset[j].working_date.slice(4,6);
              var day = event.recordset[j].working_date.slice(6,8);
              if (event.recordset[j].begintime!=null) {
               var hr = event.recordset[j].begintime.slice(0,2);
               var min = event.recordset[j].begintime.slice(2,4);
             }
             var time = month+'-'+day+'-'+year+' '+hr+':'+min;
             var date = new Date(time);
             var string = date.toDateString();
             var filter = string.slice(4, 40);
             var appointmenTime = filter +' '+ date.toLocaleString('en-US', {hour:'numeric', minute:'numeric', hour12: true});
             var eventsToupdate = {'appointmentTime': appointmenTime,
               'location': event.recordset[j].Location,
               'appointmentType': event.recordset[j].Event,
               'description': event.recordset[j].Details,
               'speciality': event.recordset[j].Event
             }
             newData[i].Appointment.push(eventsToupdate);
//	console.log(newData);
           }
         }
//db.close();    
   }
       console.log('Total Records for doctors collections : ',data.recordset.length);
       _.forEach(newData,function(list) {
//                        var collection = db.collection('doctors');
                             // collection.findAndModify({
// console.log(list);
//console.log('here');
// process.exit();
// console.log(list);
			if(list.Appointment.length>0) {
			for (var i=0; i<=list.Appointment.length-1;i++) {
                              db.command(
                              {
                                findAndModify: "doctors",
                                query:{"username":list.username},
                                update: { $addToSet: {Appointment: {appointmentTime: list.Appointment[i].appointmentTime, description:list.Appointment[i].description}}},
                                upsert: true
                              },function(err, user) {
                                      // if (err){
                                            // collection.insert({"username":list.username,"Appointment":list.Appointment}, function(err, result) {
                                             if (err) {
                                              console.log(err)
                                            }else {
                                              console.log(user);
                                            }
                                             // })
                                        // } if (user){
                                        //    user.Appointment.push({'appointmentTime': appointmenTime, 'location':event.recordset[j].Location, 'appointmentType$
                                        // user
                                        // }
                                      })

}
}

                            })

//})
request.query("select * from Events", function (err, location) {
  if (err) {
    console.log(err)
  }
//  console.log('total records for length' ,location.recordset.length);
  _.forEach(location.recordset,function(list) {
    // var collection = db.collection('specialities');
    // collection.insert({speciality:list.event}
    db.command(
    {
      findAndModify: "specialities", 
      query:{"speciality":list.event},
      update: {"speciality": list.event},
      upsert: true
    }, function(err, result) {
      if (err) {
       console.log(err)
     }else {
//                            // console.log(result);
}
})
  })
});
request.query("select distinct Location from viewDrCardClinicLocations",function (err, location) {
  if (err){
    console.log(err)
  }
 // console.log('Total records for location ',location.recordset.length)
  _.forEach(location.recordset,function(list){
    // var collection = db.collection('locations');
    // collection.insert({location:list.Location}
    db.command(
    {
      findAndModify: "locations", 
      query:{"location":list.Location},
      update: {"location":list.Location},
      upsert: true
    }, function(err, result){
      if (err) {
   //    console.log(err)
     } else {
                                                            //console.log(result);
                                                          }
                                                        })
  })
  db.close();
  console.log('Script has been finished for date',newDate);
  process.exit();
})


})
})
})
})


