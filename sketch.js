// Nessa versão, colocarei a Terra, para desenhar os terremotos nela.
// USGS Earthquake API:
//   https://earthquake.usgs.gov/fdsnws/event/1/#methods
let angle = 0;
var total;
var quakes;
let n = 0; //numero de terremotos com magnitude escolhida
let nn = 1;
let assinatura;
var lat = [];
var long = [];
var hora = [];
var Mag = []
var Name = [];

function preload() {

  terra = loadImage('earthmap1k.jpg');
  //let url = 'all_day.geo.json';
  let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
  quakes = loadJSON(url);
}

function setup() {
  frameRate(1);
  //noLoop();
  //saveJSON(quakes, 'all_day.geo.json', false);
  createCanvas(640, 300, WEBGL);
  assinatura = createGraphics(10, 10);
  assinatura.background(255, 55);
  assinatura.fill(0);
  assinatura.textAlign(CENTER);
  assinatura.textSize(150);
  assinatura.text('4.5', 0, 0);
  createP('Discos em vermelho representam sismos de magnitude acima de 5.  Abaixo,  lista de sismos acima de magnitude 3.')
  createElement('h3', 'Lista de Terremotos com magnitude acima de 3, nas últimas  24 horas.');
  createElement('h5', 'autor: Enivaldo Bonelli, enivaldob@yahoo.com ');

  var features = quakes.features;
  var geometry = quakes.geometry;
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

  createP("Agora é " + dia + "/" + mes + "/" + ano + " " + hours + ":" + minutes);

  //Agradecimentos
  createElement('center', 'Agradecimentos a');
  createElement('center', 'Daniel Shiffman,');
  createElement('center', 'The Processing Foundation,');
  createElement('center', 'and the USGS');

  for (var i = 0; i < total; i++) {

    let time = features[i].properties.time;
    Mag[i] = features[i].properties.mag;
    Name[i] = features[i].properties.place;
    //====================
    lat[i] = features[i].geometry.coordinates[1];
    long[i] = features[i].geometry.coordinates[0];
    //print(long, lat);
    //====================
    var sismoTempo = new Date(time);
    var sismoHora = sismoTempo.getHours();
    var sismoMin = sismoTempo.getMinutes();
    var OntemHoje;
    if (sismoHora > hours) {
      OntemHoje = "Ontem";
    } else {
      OntemHoje = "Hoje";
    }
    if (Mag[i] > 3) {
      n++;
      createP('Local: ' + Name[i]);
      createP('Magnitude ' + Mag[i]);
      createP('Quando: ' + sismoHora + ":" + sismoMin + "   " + OntemHoje);
      createP('::::::::::::::Sismo ' + n + '/' + i + '/' + total);
    }
  }
}

function draw() {

  push();
  texture(terra);
  translate(0, 0);
  plane(640, 300);
  pop();
  for (var j = total; j > 0; j--) {
    let yylat = map(lat[j], 90, -90, -height / 2, height / 2, true);
    let xlong = map(long[j], -180, 180, -width / 2, width / 2, true);
    push();
    //translate(0,-85)
    translate(xlong, yylat);
    texture(assinatura);
    rotateX(1.5);
    if (Mag[j] > 5) {
      fill(255, 0, 0, 222);
    } else {
      fill(255, 255, 0, 88)
    }
    cylinder(nn * Mag[j], 5);
    pop();
  }
  if (nn > 2) {
    nn--;
  } else {
    nn++;
  }
}