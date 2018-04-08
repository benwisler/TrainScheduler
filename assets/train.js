var config = {
    apiKey: "AIzaSyCPJ27kaDI1LD4DsaoVLKKPgtnATAot0Ng",
    authDomain: "trainscheduler-57ead.firebaseapp.com",
    databaseURL: "https://trainscheduler-57ead.firebaseio.com",
    projectId: "trainscheduler-57ead",
    storageBucket: "",
    messagingSenderId: "331965348508"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
$(document).ready(function (){
$("#submitTrain").submit(function (event){
    event.preventDefault();
    var userName = $("#userName").val().trim();
	var userDestination = $("#userDestination").val().trim();
	var userFirstTime = moment($("#userFirstTime").val().trim(), "hh:mm").format("X");
    var userFrequency = $("#userFrequency").val().trim();
    var date = new Date(userFirstTime*1000);
    var h = date.getHours();
    var m = date.getMinutes();
    var time = (h + ":" + m);
    if(userName != "" && userFirstTime !=="" && userFrequency !=="" && userDestination !=="")
    {
    var train = {
        userName: userName,
        userDestination: userDestination,
        userFirstTime: time,
        userFrequency: userFrequency
    }
    database.ref().push(train);
    }
    else {alert("Please Fill Out All Fields")}
    return false;

})
database.ref().on("child_added", function(childSnapshot, prevChildKey){
    var name = childSnapshot.val().userName;
    var end = childSnapshot.val().userDestination;
    var start = childSnapshot.val().userFirstTime;
    var frequency = childSnapshot.val().userFrequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(start, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");

$("#trains > tbody").append("<tr><td>" + name + "</td><td>" + end + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain);
})
})
