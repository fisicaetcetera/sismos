// Nessa versão, colocarei a Terra, para desenhar os terremotos nela.
// Examples use USGS Earthquake API:
//   https://earthquake.usgs.gov/fdsnws/event/1/#methods
let angle = 0;
var total;
var tempoLocalms;
var quakes;
let n = 0; //numero de terremotos com magnitude escolhida
function preload() {
  terra = loadImage('earthmap1k.jpg');
  let url =
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/' +
    'summary/all_day.geojson';
  quakes = loadJSON(url);
}

function setup() {
  createCanvas(640, 480, WEBGL);
  createElement('h3', 'Lista de Terremotos com magnitude acima de 3, nas últimas  24 horas.');
  createElement('h5', 'autor: Enivaldo Bonelli, enivaldob@yahoo.com ');

  var features = quakes.features;
  total = features.length;

  //Imprime a hora
  var currentTime = new Date();
  dia = currentTime.getDate();
  hours = currentTime.getHours();
  minutes = currentTime.getMinutes();
  mes = currentTime.getMonth() + 1;
  ano = currentTime.getFullYear();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (hours == 0) {
    hours = 12;
  }
  tempoLocalms = currentTime.getTime();
  createP("Agora é " + dia + "/" + mes + "/" + ano + " " + hours + ":" + minutes);
  //createP("OU");
  //createP(tempoLocalms + "  Milisegundos");

  //Agradecimentos
  createElement('center', 'Agradecimentos a');
  createElement('center', 'Daniel Shiffman,');
  createElement('center', 'The Processing Foundation,');
  createElement('center', 'and the USGS');
  for (var i = 0; i < total; i++) {

    let time = features[i].properties.time;
    let Mag = features[i].properties.mag;
    let Name = features[i].properties.place;
    var sismoTempo = new Date(time);
    var sismoHora = sismoTempo.getHours();
    var sismoMin = sismoTempo.getMinutes();
    var OntemHoje;
    if (sismoHora > hours) {
      OntemHoje = "Ontem";
    } else {
      OntemHoje = "Hoje";
    }
    if (Mag > 3) {
      n++;
      createP('Local: ' + Name);
      createP('Magnitude ' + Mag);
      createP('Quando: ' + sismoHora + ":" + sismoMin + "   " + OntemHoje);
      createP('::::::::::::::Sismo ' + n + '/' + i + '/' + total);
    }
  }
}

function draw() {

  background(0);
  angle += 0.001;
  //pointLight(255,0,0,-200,0,0);
  //directionalLight(255, 255, 0, 1, 0, 0);
  directionalLight(150, 150, 150, 0, 0, -1);
  //pointLight(255, 0,0,0,-200,0);
  rotateY(angle);
  //noStroke();
  texture(terra);
  sphere(200);
  
}