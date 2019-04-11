// Examples use USGS Earthquake API:
//   https://earthquake.usgs.gov/fdsnws/event/1/#methods

var quakes;

function preload() {
  let url =
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/' +
    'summary/all_day.geojson';
  quakes = loadJSON(url);
}

function setup() {
  noCanvas();

  var features = quakes.features;
let total = features.length;
  //Agradecimentos
  createElement('center','Agradecimentos');
  createElement('center','Daniel Shiffman, The Processing Foundation');
  createElement('center','and USGS');
  for (var i = 0; i < features.length; i++) {  
    let time = features[i].properties.time;
    let Mag = features[i].properties.mag;
    let Name = features[i].properties.place;
    if(Mag > 3){
    createP('Local: ' + Name);
    createP('Magnitude ' + Mag);
    createP('Hora: ' + time);
      createP('::::::::::::::Sismo ' +i+'/'+total);
    }
  }
  }
