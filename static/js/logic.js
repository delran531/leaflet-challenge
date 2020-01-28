var equakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// console.log(equakeURL)
// Get data and send to function
d3.json(equakeURL, function(data) {
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
    // Define map layers
    var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetMap.org/\">OpenstreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetMap.org/\">OpenstreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });

    var satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetMap.org/\">OpenstreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  
  //Create cirle array
  var myCircleList = []; 

    //Loop through circles to create a markers
    for (var i = 0; i < earthquakeData.length; i++) {

        coordinates = [earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]]
        properties = earthquakeData[i].properties;

        if (properties.mag <1) {
          color = 'yellow';
        }
        else if (properties.mag <2){
          color = 'gold'
        }
        else if (properties.mag <3){
          color = 'orange'
        }
        else if (properties.mag <4){
          color = 'red'
        }
        else if (properties.mag <5){
          color = 'brown'
        }
        
        //Map circles
        var myCircle = L.circle(coordinates, {
            fillOpacity: 0.75,
            color: color,
            fillColor: color,
            radius: (properties.mag * 15000)
        }).bindPopup("<h3>" + properties.place + "</h3> <hr> <p>Magnitude: " 
        + properties.mag + "</p>" + "<p>  Date: "  + new Date(properties.time) + "</p>");
        myCircleList.push(myCircle);
    }
    
    //Earthquake layer
    var earthquakes = L.layerGroup(myCircleList);
    
    // Define a baseMaps object
    var baseMaps = {
      "Street Map": streetMap,
      "Dark Map": darkMap,
      "Satallite Map": satMap
    };
  
    // Create overlay object to hold overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetMap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }