// Quakes every 24 hours mapped on flat earth.
// Calculates and writes the moon declination
// This version: including the moon en 3D, with texture.
//mostly recent:working on sun's longitudinal motion, no declination.
// USGS Earthquake API:
//   https://earthquake.usgs.gov/fdsnws/event/1/#methods
let angle = 0;
let angulo;
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
var h3;
let degtorad = 57.296;
let dia, hours, minutes, seconds, mes, ano;
let sunlong, sunlat, moonLong = 29;
let UT, TZ;
let factor = 1;
let radius;

function preload() {

  terra = loadImage('earthmap1k.jpg');
  moon = loadImage('moonmap1k.jpg');
  sol = loadImage('sun.jpg');
  //let url = 'all_day.geo.json';
  let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
  quakes = loadJSON(url);
}

function setup() {

  frameRate(1);

  angulo = random(0., 3.14);
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

  tempo(); //obtem a data e hora
  h3 = createElement('h5', (dia + "/" + mes + "/" + ano + " " + hours + ":" + minutes + ":" + seconds));

  createP('Discos em vermelho representam sismos de magnitude acima de 5.  Abaixo,  lista de sismos acima de magnitude 3.')
  h5 = createElement('h5', 'Lista de Terremotos com magnitude acima de 3, nas últimas  24 horas.');
  createElement('h5', 'autor: Enivaldo Bonelli, enivaldob@yahoo.com ');

  var features = quakes.features;
  var geometry = quakes.geometry;
  total = features.length;

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

  //clear();
  noStroke();

  //Imprime a hora
  tempo();
  h3.html(dia + "/" + mes + "/" + ano + " " + hours + ":" + minutes + ":" + seconds);
  //  
  push();
  texture(terra);
  translate(0, 0);
  plane(640, 300);
  pop();
  //console.log(width, height);
  //desenha a lua

  let ylua = map(declinacao(), 90, -90, -height / 2, height / 2, true);
  radius = 10 * factor;
  //push();
  console.log('moon long inicial = ' + moonLong)
  moonLong = moonLong - 0.0043;
  let xMoon = map(moonLong, -180, +180, -width / 2, width / 2, true);
  push();
translate(xMoon, ylua, 70);
  rotateY(angulo);
  texture(moon);
  sphere(radius);
  pop();
  
  // sol
  sunlat = 17; //graus falta equacao
  sunlong = ((12-UT)/24 * 360);
  console.log('sunlong = ...', + sunlong);
  if(sunlong < -180){
    sunlong += 360; 
  }
    let xSol = map(sunlong, -180, +180, -width / 2, width / 2, true);

    let ySol = map(sunlat, 90, -90, -height / 2, height / 2, true);
  
  push()
  translate(xSol, ySol, 40);
  rotateY(angulo);
  texture(sol);
  //fill(200,255,0,10);
  sphere(radius);
  pop();
  console.log('sunlong = ' + sunlong + 'lualong = ' + xMoon);

  for (var j = total; j > -1; j--) {
    //console.log(j);
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

function tempo() {
  var currentTime = new Date();
  dia = currentTime.getDate();
  hours = currentTime.getHours();
  minutes = currentTime.getMinutes();
  seconds = currentTime.getSeconds();
  mes = currentTime.getMonth() + 1;
  ano = currentTime.getFullYear();
  tempoNodia = (hours*3600 + minutes * 60 + seconds)/3600; 
  TZ = currentTime.getTimezoneOffset()/60;
  UT = tempoNodia + TZ;
  console.log('TZ = ' +TZ + ',  UT = ' + UT );
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (hours == 0) {
    hours = 12;
  }
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


function mousePressed() {
  console.log(factor);
  if (factor === 1) {
    factor = 3;
  } else {
    factor = 1;
  }
  console.log(factor);
  return false;
}
