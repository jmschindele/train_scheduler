
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC9nFSfbr8HftCw-AiPOsJVDg86pD70bTE",
    authDomain: "train-scheduler-10f89.firebaseapp.com",
    databaseURL: "https://train-scheduler-10f89.firebaseio.com",
    projectId: "train-scheduler-10f89",
    storageBucket: "train-scheduler-10f89.appspot.com",
    messagingSenderId: "283295936709"
  };

  firebase.initializeApp(config);

  //create a variable to access firebase

  var database = firebase.database();

  

  //establish some variables

  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var trainFrequency = 0;
  var isValid = false;

  //users submit  train name, destination, first train time in military time, frequency in minutes
$("#submit-button").on("click", function(event){

  event.preventDefault();
  

  
  

   trainName = $("#name").val().trim();
   destination = $("#destination").val().trim();
   firstTrainTime = $("#first-time").val().trim();
   trainFrequency = $("#frequency").val().trim();
  //   console.log(parseInt(trainFrequency));
  formCheck();

if (formCheck (isValid) === true) {

//create train object

var newTrain = {
  name: trainName,
  destination: destination,
  start: firstTrainTime,
  interval: trainFrequency
};

database.ref().push(newTrain);

//clear text boxes


$("#name").val("");
$("#destination").val("");
$("#first-time").val("");
$("#frequency").val("");



    //create a new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(trainFrequency),
      $("<td>").text(nextTrain.format('hh:mm A')),
      $("<td>").text(minTilTrain)
    );
    
    $("#train-schedule").append(newRow);
//add database entries to the table

// initialize();


  //users from many different machines must be able to view the same train times(this means back up to firebase)


    }
  // form validation
function formCheck() {
  //name form
if (trainName === "") {
  alert("Train name cannot be left blank.");
  return false;
} else 
  //destination form
  if (destination === "") {
    alert("Train destination cannot be left blank.");
    return false;
  } else 
  //interval form
  if (isNaN(parseInt(trainFrequency))) {
    alert("Frequency must be a number")
    return false;
  } else {
    return true;
  }
}

});

window.onload = initialize ();

function initialize (){


  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    //store everything into a variable
  
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().start;
    var trainFrequency = childSnapshot.val().interval;
  
    console.log(trainName, destination, firstTrainTime, trainFrequency);
  
  
    //convert first train time to military time
    var firstTimeFormat = moment(firstTrainTime,'HH:mm');
    console.log(firstTimeFormat);

  
    //convert first train to next train
  //get current time
  var currentTime = moment();
  
  //create a variable to store next train time
  var nextTrain;
  
  //if the times time is in the future, set next train to then
  
  if (firstTimeFormat > currentTime) {
    nextTrain = firstTrainTime;
  } else {
     //otherwise, get minutes past first time
  var minutesPast = currentTime.diff(firstTimeFormat, 'minutes');
  //find the result of minutesPast % frequency
  var remainder = minutesPast % trainFrequency;
  //get difference of frequency from remainder and store as time till next train
  var minTilTrain = trainFrequency - remainder;
  //set next train to = now plus remainder
  nextTrain = currentTime.add(minTilTrain, 'minutes');
   }
  
    //create a new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(trainFrequency),
      $("<td>").text(nextTrain.format('hh:mm A')),
      $("<td>").text(minTilTrain)
    );
    
    $("#train-schedule").append(newRow);
    console.log('Next Train Arrival Time:', nextTrain.format('hh:mm A'));
  })
}




