let currentIndex = 0;
let selectedLocations = [];
let apiResponses = [];
var myChart;
//the DOMContentLoaded event,  ensures that the code runs only
//after the HTML document has been fully loaded.
document.addEventListener("DOMContentLoaded", function () {
  //this function makes a request to the "getTownData.php" file and
  //retrieves the town data in JSON format. The data is then parsed and used to populate
  //the dropdown menu with town names.
  let displayTownNames = () => {
    url = "getTownData.php";
    ajaxRequest(url, "GET", "", displayData);
  };
  //This function parses the JSON data and
  // populates the dropdown menu with town names.
  let displayData = (responseA) => {
    let towns = JSON.parse(responseA);
    //sorting the array alphabetically by town name 
    towns.sort((a, b) => {
      return a.engname.localeCompare(b.engname);
  });
    console.log("this is what is in the array ", towns);//testing

    // Get the dropdown element
    let dropdown = document.getElementById("townDropdown");

    // Clear previous options
    dropdown.innerHTML = "";

    // Add a default option
    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a town";
    dropdown.appendChild(defaultOption);

    // Add options for each town
    towns.forEach((town) => {
      let option = document.createElement("option");
      option.value = town.engname;
      option.textContent = town.engname;
      dropdown.appendChild(option);
    });

    //Button to create a compare graphs button
    let multiGButton = document.createElement("button");
    multiGButton.textContent = "Compare Graph";

    multiGButton.addEventListener("click", function () {
    console.log(selectedLocations);
    resetApiArray();

    });
    let compaireGraphDiv = document.getElementById("compaireGraph");
    compaireGraphDiv.appendChild(multiGButton);
  };

  function getTownInfo(townName){
    let towns = JSON.parse(responseA);
    // Find the town object in the towns array
    let town = towns.find((town) => town.engname === townName);

    // Check if the town object exists
    if (town) {
      console.log(town.info);
      if (selectedLocations.length >= 2) {
        // If the array already has 6 or more elements, remove the first one
        selectedLocations.shift();
      }
      // Push the new town to the end of the array
      selectedLocations.push({ name: townName, lat: town.lat, lon: town.lon });
      return {
        info: town.info,
        lat: town.lat,
        lon: town.lon,
      };
    } else {
      return "No information available for " + townName;
    }
  };

  let displayError = () => {
    console.error("An error occured when fetching the data");
  };

  let ajaxRequest = (url, method, data, callback) => {
    request = new XMLHttpRequest();
    request.onload = function () {
      responseA = request.responseText;
      callback(responseA);
    };
    request.onerror = displayError;
    request.open(method, url);
    if (method == "POST") {
      request.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
    }
    request.send(data);
  };

  // Event listener to print selected value to console testing purposes
  document
    .getElementById("townDropdown")
    .addEventListener("change", function (event) {
      let selectedValue = event.target.value;
      console.log("Selected value:", selectedValue);
    });
  displayTownNames();

  //Event listener to create and display town widget when a town is selected
  let selectedTownsFromDropDown = [];
  document
    .getElementById("townDropdown")
    .addEventListener("change", function (event) {
      let selectedTown = event.target.value;

    // Check if the town is not already selected
    if (!selectedTownsFromDropDown.includes(selectedTown)) {
        let townInfo = getTownInfo(selectedTown);
        if (townInfo) {
            let townWidget = new TownWidget([
                selectedTown,
                townInfo.info,
                townInfo.lon,
                townInfo.lat,
            ]);
            townWidget.display();

            // Add the selected town to the array
            selectedTownsFromDropDown.push(selectedTown);

            // Disable the selected option in the dropdown menu
            //event.target.options[event.target.selectedIndex].disabled = true;
        }
    } else {
        // Disable the selected option in the dropdown menu
        event.target.options[event.target.selectedIndex].enable = true;
    }
});

function removeTown(selectedTown) {
  let index = selectedTownsFromDropDown.indexOf(selectedTown);
  if (index !== -1) {
      selectedTownsFromDropDown.splice(index, 1);
  }
}

  //constructor function to create the widget for the towns
  function TownWidget(townArray) {
    this.engname = townArray[0];
    this.info = townArray[1];
    this.lon = townArray[2];
    this.lat = townArray[3];

    console.log(townArray);
    // Method to create and display the town widget
    this.display = function () {
      // Create the widget container
      let widgetContainer = document.createElement("div");
      widgetContainer.classList.add("town-widget");

      // Add town name to the widget
      let townNameElement = document.createElement("h2");
      townNameElement.textContent = this.engname;
      widgetContainer.appendChild(townNameElement);

      // Add town information tot he widget
      let townInfoElement = document.createElement("p");
      townInfoElement.textContent = this.info;
      widgetContainer.appendChild(townInfoElement);

      //get the nanme , lat and lon of the location picked
      let nameT = this.engname;
      let position = this.lat + "," + this.lon;
      console.log(position);

      // Button to display weather graph
      let weatherButton = document.createElement("button");
      weatherButton.textContent = "Display Weather Graph";

      weatherButton.addEventListener("click", function (){
        console.log(nameT, position);
        apiRequest(nameT, position);
      });
      widgetContainer.appendChild(weatherButton);

      // Button to remove the widget
      let removeButton = document.createElement("button");
      removeButton.textContent = "Remove Widget";
      removeButton.addEventListener("click", function () {
        widgetContainer.remove();
        removeTown(nameT);
        //document.querySelector('#townDropdown option[value="${nameT}"]').disabled = false;
 

      });
      widgetContainer.appendChild(removeButton);

      // Add the widget to the page
      document.getElementById("widgetSpot").appendChild(widgetContainer);
    };
  }
  //function to reset the array with all the  towns widgets picked so the createGraghMulti function uses the correct data
  function resetApiArray(){
    apiResponses = [];
    currentIndex = 0;

  if (selectedLocations.length > 0) {
    // Start processing selected locations
    callApiRequestMulti();
  } else {
    console.log("No locations selected");
  }
  }
  // Function to call API request for every widget that  needs data extracted
function callApiRequestMulti() {
  if (currentIndex < selectedLocations.length) {
      let currentLocation = selectedLocations[currentIndex];
      console.log(currentLocation.name ,currentLocation.lat , currentLocation.lon );
      apiRequestMulti(currentLocation.lat, currentLocation.lon)
          .then(response => {
              // Handle response here
              console.log(response , "this this from the apiRequestMulti function concole log ");
              apiResponses.push(response);
              // Increment currentIndex to move to the next location
              currentIndex++;

              // Call the function recursively to process the next location
              callApiRequestMulti();
          })
          .catch(error => {
              // Handle error here
              console.error(error);

              // Increment currentIndex to move to the next location
              currentIndex++;
              // Call the function recursively to process the next location
              callApiRequestMulti();
         });
  } else {
      console.log("All locations processed");
      console.log("Responses for the api array:", apiResponses);
  }
  createGraghMulti(apiResponses);
}

  function apiRequest(townSelected, posisionSelected) {
    console.log(
      "boo this was called with this twon nmane",
      townSelected,
      posisionSelected
    ); //testing purposes only

    // The code provided by the tomorrow api website not my own code
    const options = { method: "GET", headers: { accept: "application/json" } };
    let url =
      "https://api.tomorrow.io/v4/weather/history/recent?location=" +
      posisionSelected +
      "&apikey=862LuX6a84HQcsYH3GrF4GbH08Z2X1oC";
    fetch(url, options)
      .then((response1) => response1.json())
      .then((response1) => {
        console.log(
          "this is the value form response inside the fetch ",
          response1
        );
        createGraghSingle(response1, townSelected);
        
      })
      .catch((err) => console.error(err));
  }

  function apiRequestMulti(posisionSelectedlat, posisionSelectedlon) {
    return new Promise((resolve, reject) => {
        const options = { method: "GET", headers: { accept: "application/json" }};
        let url =
            "https://api.tomorrow.io/v4/weather/history/recent?location=" +
            posisionSelectedlat + "," + posisionSelectedlon +
            "&apikey=862LuX6a84HQcsYH3GrF4GbH08Z2X1oC";
        fetch(url, options)
            .then((response1) => response1.json())
            .then((response1) => {
                console.log(
                    "this is the value form response inside the fetch multi ",
                    response1
                );
                resolve(response1);               
            })
            .catch((err) => reject(err));
    });
}

  function createGraghSingle(tool, twonNmae) {

    let hourlyData = tool.timelines.hourly;
    let timestamps = hourlyData.map((hour) =>
      new Date(hour.time).toLocaleTimeString()
    );
    let temperatures = hourlyData.map((hour) => hour.values.temperature);

    if (myChart) {
      myChart.destroy();
    }

    const chartData = {
      labels: timestamps,
      datasets: [
        {
          label: twonNmae,
          data: temperatures,
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 2,
          fill: false,
        },
      ],
    };

    const config = {
      type: "line",
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "temp C",
            },
          },
        },
      },
    };

    myChart = new Chart(document.getElementById("temperatureChart"), config);
  }

  function createGraghMulti(dataSets) {
    console.log("createGraphComparison is being called ");
    console.log(dataSets);
    // Extract data for each location
    let data1 = dataSets[0];
    let name1 = selectedLocations[0];
    
    let data2 = dataSets[1];
    let name2 = selectedLocations[1];

    // Extract hourly data and timestamps for each location
    let hourlyData1 = data1.timelines.hourly;
    let nameLocation1 = name1.name;
    let hourlyData2 = data2.timelines.hourly;
    let nameLocation2 = name2.name;

    console.log(selectedLocations);
    console.log(nameLocation1 + nameLocation2);
    
    let timestamps1 = hourlyData1.map((hour) =>
        new Date(hour.time).toLocaleTimeString()
    );
    let temperatures1 = hourlyData1.map((hour) => hour.values.temperature);
    let temperatures2 = hourlyData2.map((hour) => hour.values.temperature);
    if (myChart) {
        myChart.destroy();
    }
    const chartData = {
        labels: timestamps1, 
        datasets: [
            {
                label: nameLocation1, 
                data: temperatures1,
                borderColor: "rgb(255, 99, 132)",
                borderWidth: 2,
                fill: false,
            },
            {
                label: nameLocation2,
                data: temperatures2,
                borderColor: "rgb(54, 162, 235)",
                borderWidth: 2,
                fill: false,
            },
        ],
    };
    const config = {
        type: "line",
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Temp C",
                    },
                },
            },
        },
    };
    myChart = new Chart(document.getElementById("temperatureChart"), config);
}
});

//tomoorow look at the the 3 wronge things left
//drop down name not adding it back straight after removale
//not removing the removed town from the draw garph array 
//try change it so that you can pick which 2 and not just the last 2 picked
//