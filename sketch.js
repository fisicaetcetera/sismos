// Quakes every 24 hours mapped on flat earth.
// Calculates and writes the moon declination
// This version: including the moon en 3D, with texture.
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
var h5;
var h6;
let degtorad = 57.296;

function preload() {

  terra = loadImage('earthmap1k.jpg');
  moon = loadImage('moontexture.jpg');
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
  assinatura.textSize(75);
  assinatura.text('4.5', 0, 0);
  
  h4 = createElement('h5', 'Declinacao estimada da Lua : ' + declinacao());
  createP('Discos em vermelho representam sismos de magnitude acima de 5.  Abaixo,  lista de sismos acima de magnitude 3.')
  h5 = createElement('h5', 'Lista de Terremotos com magnitude acima de 3, nas últimas  24 horas.');
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

  clear();
  noStroke();
  push();
  texture(terra);
  translate(0, 0);
  plane(640, 300);
  pop();
  console.log(width, height);
  //desenha a lua
  push()
  let ylua = map(declinacao(), 90, -90, -height / 2, height / 2, true);
  rotateY(frameCount/10000);
  translate(-38, ylua, 50);
  texture(moon);
  sphere(11);

  pop();
  //
  
  for (var j = total; j > -1; j--) {
    console.log(j);
    let yylat = map(lat[j], 90, -90, -height / 2, height / 2, true);
    let xlong = map(long[j], -180, 180, -width / 2, width / 2, true);
    push();
    //translate(0,-85)
    translate(xlong, yylat);
    texture(assinatura);
    rotateX(1.5);
    if (Mag[j] > 5) {
      fill(255, 0, 0, 225);
    } else {
      fill(125, 255, 150, 50)
    }
    cylinder(nn * Mag[j], 5);
    pop();
  }
  if (nn > 2) {
    nn--;
  } else {
    nn++;
  }
  h4.html('Declinacao estimada da Lua : ' + declinacao());
}


function declinacao() {


  // tempo desde 200001010000
  let timestamp = new Date().getTime();
  let stampj2000 = (new Date('2000-01-01T12:00:00Z')).getTime();
  //console.log('stampj2000 = ', stampj2000);
  let epoca = (timestamp - stampj2000) / 1000;
  //console.log('epoca = ' + epoca);
  let numdias = epoca / 86400;
  //console.log('numero de dias = ' + numdias);
  let u = numdias - 0.48 * sin(TWO_PI * (numdias - 3.45) / 27.5545);
  //console.log(' u = ' + u);
  let delta1 = 23.4 * sin(TWO_PI * (u - 10.75) / 27.32158);
  let delta2 = 5.1 * sin(TWO_PI * (u - 20.15) / 27.21222);
  //console.log('delta1 = ' + delta1);
  //console.log('delta2 = ' + delta2);
  //console.log(delta1 + delta2);
  return (delta1 + delta2).toFixed(5);
}
