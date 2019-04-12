// Examples use USGS Earthquake API:
//   https://earthquake.usgs.gov/fdsnws/event/1/#methods
var total;
var tempoLocalms;
var quakes;
let n = 0; //numero de terremotos com magnitude escolhida
function preload() {
  let url =
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/' +
    'summary/all_day.geojson';
  quakes = loadJSON(url);
}

function setup() {
  createCanvas(640, 50);
  createElement('h3','Lista de Terremotos com magnitude acima de 3, nas últimas  24 horas.');
  createElement('h5','autor: Enivaldo Bonelli, enivaldob@yahoo.com ');

  var features = quakes.features;
  total = features.length;

  //Imprime a hora
  var currentTime = new Date();
    dia = currentTime.getDate();
    hours = currentTime.getHours();
    minutes = currentTime.getMinutes();
    mes = currentTime.getMonth()+1;
    ano = currentTime.getFullYear();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (hours == 0) {
    hours = 12;
  }
  tempoLocalms = currentTime.getTime();
  createP("Agora é "+dia + "/"+ mes +"/"+ano+" "+ hours + ":" + minutes);
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
    if(sismoHora > hours){
     OntemHoje = "Ontem";
    }else{
     OntemHoje ="Hoje"; 
    }
    if (Mag > 3) {
      n++;
      createP('Local: ' + Name);
      createP('Magnitude ' + Mag);
      createP('Quando: ' + sismoHora+":"+sismoMin+"   "+OntemHoje);
      createP('::::::::::::::Sismo ' + n + '/' + i + '/' + total);
    }
  }
}

function draw() {

  background(6*n, 0, total-n);
}