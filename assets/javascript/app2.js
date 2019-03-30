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

var database = firebase.database();

//button for adding trains

var isValid = false;
//ADD CLICK HANDLER HERE
$("#submit-button").on("click", function(event) {
  event.preventDefault();

  //grab user input
  formCheck();
  if (isValid === true) {
    var trainName = $("#name")
      .val()
      .trim();
    var trainDestination = $("#destination")
      .val()
      .trim();
    var trainStart = $("#first-time")
      .val()
      .trim();
    var trainInterval = $("#frequency")
      .val()
      .trim();

    //create object to store train

    var newTrain = {
      name: trainName,
      destination: trainDestination,
      start: trainStart,
      interval: trainInterval
    };

    database.ref().push(newTrain);

    console.log(
      newTrain.name,
      newTrain.destination,
      newTrain.start,
      newTrain.interval
    );

    $("#name").val("");
    $("#destination").val("");
    $("#first-time").val("");
    $("#frequency").val("");
  }
});
//END CLICK HANDLER HERE

//create a firebase event for adding employee to the database and a row in the html when a user adds an entry

database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainInterval = childSnapshot.val().interval;

  //DO TIME MATH HERE

  //first train time
  var firstTime = moment(trainStart, "HH:mm");

  //current time
  var currentTime = moment();

  //store next train
  var nextTrain;

  //if first time is in future
  if (firstTime > currentTime) {
    nextTrain = firstTime;
  } else {
    var minutesPast = currentTime.diff(firstTime, "minutes");
    var remainder = minutesPast % trainInterval;
    var minutesTilNextTrain = trainInterval - remainder;
    nextTrain = currentTime.add(minutesTilNextTrain, "minutes");
  }

  console.log("Next Train Arrival Time: ", nextTrain.format("hh:mm A"));

  //STOP TIME MATH HERE

  //DOM UPDATE
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainInterval),
    $("<td>").text(nextTrain.format("hh:mm A")),
    $("<td>").text(minutesTilNextTrain)
  );

  $("#train-schedule > tbody").append(newRow);
});

function formCheck() {
  //name form
  if (
    $("#name")
      .val()
      .trim() === ""
  ) {
    alert("Train name cannot be left blank.");
    isValid = false;
    return;
  }
  //destination form
  else if (
    $("#destination")
      .val()
      .trim() === ""
  ) {
    alert("Train destination cannot be left blank.");
    isValid = false;
    return;
  }
  //interval form
  else if (
    isNaN(
      parseInt(
        $("#frequency")
          .val()
          .trim()
      )
    )
  ) {
    alert("Frequency must be a number");
    isValid = false;
    return;
  } else {
    isValid = true;
    return;
  }
}
