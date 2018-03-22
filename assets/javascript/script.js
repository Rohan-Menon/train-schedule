

$(document).ready(function () {




    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB0jsO_gi9mY649Fshj1fTzrCmS7FQCXPo",
        authDomain: "trainschedule-47113.firebaseapp.com",
        databaseURL: "https://trainschedule-47113.firebaseio.com",
        projectId: "trainschedule-47113",
        storageBucket: "",
        messagingSenderId: "931630922233"
    };
    firebase.initializeApp(config);




    var dbRef = firebase.database().ref();

    dbRef.on("value", function (snapshot) {
        $("tbody").empty();

        var data = snapshot.val();

        for (var key in data) {

            var name = data[key].name;
            var destination = data[key].destination;
            var initArrivalTime = data[key].arrivalTime;
            var initArrivalDate = data[key].arrivalDate;
            var frequency = data[key].frequency;

            var initMoment = moment(initArrivalDate + " " + initArrivalTime, "MM-DD-YYYY HH:mm");

            var minuteDiff = Math.trunc(moment.duration(moment().diff(initMoment)).asMinutes());

            if (minuteDiff < 0) {
                var currentArrival = moment(initArrivalTime, "HH:mm").format("hh:mm A");
                var minutesRemaining = minuteDiff * -1;
            }
            else {
                var minutesRemaining = frequency - minuteDiff % frequency;

                var currentArrival = moment().add(minutesRemaining, 'minutes').format("hh:mm A");
            }

            console.log(name + " " + minuteDiff + " " + minutesRemaining);


            var newRow = $("<tr>");

            newRow.append($("<td class='text-center'>" + name + "</td>"));
            newRow.append($("<td class='text-center'>" + destination + "</td>"));
            newRow.append($("<td class='text-center'>" + frequency + "</td>"));
            newRow.append($("<td class='text-center'>" + currentArrival + "</td>"));
            newRow.append($("<td class='text-center'>" + minutesRemaining + "</td>"));




            $("tbody").append(newRow);
        }
    });



    $("#submit").on("click", function () {

        event.preventDefault();

        //check for valid input
        var errorString = checkforValidity();




        if (errorString.length > 0) {
            alert(errorString);
        }
        else {

            var trainName = $("#input1").val().trim();
            var trainDestination = $("#input2").val().trim();
            var trainArrivalTime = $("#input3").val().trim();
            var trainFreq = $("#input4").val().trim();
            var trainArrivalDate = $("#input5").val().trim();

            //sets initial arrival to current date if no date is entered
            if (trainArrivalDate.length === 0) {
                trainArrivalDate = moment().format("MM-DD-YYYY");

            }

            //clears input
            $("#input1").val("");
            $("#input2").val("");
            $("#input3").val("");
            $("#input4").val("");
            $("#input5").val("");



            dbRef.push({
                name: trainName,
                destination: trainDestination,
                arrivalTime: trainArrivalTime,
                arrivalDate: trainArrivalDate,
                frequency: trainFreq,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });


        }




    });


    //builds an errorstring of invalid input and returns it
    function checkforValidity() {
        var errorString = "";
        var trainName = $("#input1").val().trim();
        var trainDestination = $("#input2").val().trim();
        var trainArrivalTime = $("#input3").val().trim();
        var trainFreq = $("#input4").val().trim();
        var trainArrivalDate = $("#input5").val().trim();

        if (!/^[a-zA-Z0-9\s._\-]+$/.test(trainName)) {
            errorString += "Name Invalid\n";

        }

        if (!/^[a-zA-Z0-9\s._\-]+$/.test(trainDestination)) {
            errorString += "Destination Invalid\n";

        }

        if (!moment(trainArrivalTime, "HH:mm", true).isValid()) {
            errorString += "Initial Arrival Invalid\n";
        }

        if (!/^[0-9]+$/.test(trainFreq)) {
            errorString += "Frequency Invalid\n";

        }

        if (!moment(trainArrivalDate, "MM-DD-YYYY", true).isValid() && trainArrivalDate.length > 0) {
            errorString += "Initial Date Invalid\n";

        }

        return errorString;

    }



});


