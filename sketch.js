//Working very well - going to improve the graph now.
//Will create my 'map()' since the old one is not working
// Quakes every 24 hours mapped on flat earth.
// Calculates and writes the moon declination
// This version: including the moon en 3D, with texture.

// USGS Earthquake API:
//   https://earthquake.usgs.gov/fdsnws/event/1/#methods
let angle = 0;
let angulo;
let width = 1280;
let height = 600;
var total;
var quakes;
let n = 0; //numero de terremotos com magnitude escolhida
let nn = 1;
//let assinatura;
var latsys = [];
var long = [];
var hora = [];
var Mag = [];
var Name = [];
// formatação 
var h5;
var h6;
var h3;
var h11;
let degtorad = 57.296;
let currentTime;
let dia, hours, minutes, seconds, mes, ano;
let TZ;
let factor = 0;
let radius;
let declination;
let userLat, userLong;
//===== do moontrack


let lon;
let dlon;
let lonloc;
let lonlocs;
let ra, dec;
let UT;
let twopi;
let degs;
let rads;
// LUA
let am = 60.2666; //(Earth radii)  == OK 
let ecm = 0.0549; // == OK, excentricidade
let im = 5.1454; //== OK
let Nm; //longitude of the ascending node 
let Mm;
let vm; // true anomaly, é calculada abaixo
let d; //days since the date of the elements
//let n = 0.523998; //daily motion
let ne = 0.985611; //same as n, for earth
//let L = 82.9625; //mean longitude
let Le = 324.5489; //same as L, for earth
//let p = 336.322; //longitude of the perihelion, degrees
let we = 282; //same as p, for earth
//let e = 0.093346; //eccentricity of orbit
let ee = 0.016709; // same as e, for earth
//let a = 1.523762; //semi-major axis
let ae = 1.000; //same as a, for earth
//let o = 49.5574; //longitude of ascending node, degrees
let radiusMoon = 6;

let oe = 0.0; //same as o, for earth
let i = 1.8496; // inclination of plane of orbit, degrees
let ie = 0.0; // same as i, for earth

let m; //  Mean anomaly
let me;



let ve;
let r; // length of radius vector of the planet
let re;
// ecliptic coordinates of a body - cartesian
let X, Y, Z;
// ecliptic c//
//
// coordinates for Earth - cartesian
let Xe, Ye, Ze;
// distance of a body to Earth:
let distance;
//
//      SOL
let Ns = 0;
let isun = 0;
let asun = 1;
let ecs; // ecentricidade, calculada abaixo 
let Ms;
let RAs, Decs, RA, Dec; //sun, moon
let Ls; //mean longitude of the sun
    let OntemHoje;

//======

function preload() {

  terra = loadImage('earthMap.jpg');
  moon = loadImage('moonmap1k.jpg');
  sol = loadImage('sun.jpg');
  myFont = loadFont('Catallina.otf');
  //let url = 'all_day.geo.json';
  let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
  quakes = loadJSON(url);
}

function setup() {
  //localização do usuário
  fetch('https://api.geoapify.com/v1/ipinfo?apiKey=df56ea8b09b64183882faaf437ac2620')
  .then(response => response.json())
  .then(data => {
  // You can now access the location data in the "data" object
    console.log(data);
    console.log("Aqui.");
    userLat = data.location.latitude;
    userLong = data.location.longitude;
    createP('Sua localização, Lat: ' + userLat + ' Lon: ' + userLong);
  })
  //

  twopi = TWO_PI;
  degs = 180 / PI;
  rads = 1 / degs;
  //

  //======
  frameRate(1);
  angulo = random(0, 360);
  //noLoop();
  //saveJSON(quakes, 'all_day.geo.json', false);
  //
  createCanvas(width,height, WEBGL);
  //
  //assinatura = createGraphics(10, 10);
  //assinatura.background(255, 55);
  //assinatura.fill(0);
  //assinatura.textAlign(CENTER);
  //assinatura.textSize(75);
  //assinatura.text('4.5', 0, 0);

  h4 = createElement('h5', 'Declinacao da Lua : ' + 1);
  h11 = createElement('h5', 'Declinacao do Sol : ' + 1);

  tempo(); //obtem a data e hora
  h3 = createElement('h5', (dia + "/" + mes + "/" + ano + " " + hours + ":" + minutes + ":" + seconds));
  createP('Discos em vermelho representam sismos de magnitude acima de 3.5.  Abaixo,  lista de sismos acima de magnitude 3.0')
  //createElement('h5', 'Lista de Terremotos com magnitude acima de 3.5, nas últimas  24 horas.');
  createElement('h3', 'autor: Enivaldo Bonelli, enivaldob@yahoo.com ');

  var features = quakes.features;
  var geometry = quakes.geometry;
  total = features.length;
  // Apresentação, cabeçalho
    let topo = createElement('h3', 'Sismos das útimas 24 horas, maiores que 3.5 graus na escala Richter.');
    topo.style('color', 'blue');
    topo.position(10, 550);
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
    latsys[i] = features[i].geometry.coordinates[1];
    long[i] = features[i].geometry.coordinates[0];
    //print(long, latsys);
    //====================
    var sismoTempo = new Date(time);
    var sismoHora = sismoTempo.getHours();
    var sismoMin = sismoTempo.getMinutes();
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
        console.log('ontemhoje = ', OntemHoje);
    }
  }
}
///////////////////////  draw()
function draw() {
  declination = Dec;
  background(0);
  //directionalLight(255,255,0,0, 0, -1)
  noStroke();
  angulo += 0.01;
  //Imprime a hora
  tempo();
  h3.html(dia + "/" + mes + "/" + ano + " " + hours + ":" + minutes + ":" + seconds);
  //  
  rotateX(factor * 0.7);
  push();
  texture(terra);
  translate(0, 0);
  plane(width, height);
  pop();

  let ylua = map(declination, 90, -90, -height / 2, height / 2);
  console.log('declination, ylua = ', declination, ylua);

  d = numeroDeDias();
  //  SOL
  ws = FNrange((282.9404 + 4.70935E-05 * d) * rads);
  ecs = 0.016709 - 1.151E-09 * d;
  Ms = FNrange((356.047 + 0.9856002585 * d) * rads);
  Ls = FNrange(Ms + ws); //Mean Longitude of the Sun  (Ns=0)
  console.log('mean longitude of sun = ', Ls * degs);
  // console.log('numero de dias desde elementos = ' + d);
  //
  Moon(); //get RA, Dec and range for Moon AND Sun
  // console.log('RA = ', ra * degs / 15);
  // console.log('DEC = ', dec * degs);
  console.log('lon, lat = ', lon * degs, lat * degs);

  //====
  moonlong = lonloc;
  console.log('moonlong = ', moonlong);
  console.log('Lua longitude = ', moonlong)
  //let xMoon = map(moonLong, -180, 180, -width / 2, width / 2, true);
  let xMoon = (moonlong + 180) * width / 360 - width / 2;
  // console.log('width = ', width);
  // console.log('xMoon = ', xMoon);
  push();
  translate(xMoon, ylua, 5);
  rotateY(angulo);
  //texture(moon);
  fill('blue');
  sphere(radiusMoon);
  pop();
  //== do outro lado - recente
  push();
  console.log('before', xMoon, ylua);
  if (xMoon > 0) {
    xMoon = xMoon - width / 2;
  } else {
    xMoon = width / 2 + xMoon;
  }
  ylua = -ylua;
  console.log('after', xMoon, ylua);
  console.log(height / 2, width / 2);
  translate(xMoon, ylua, 5);
  rotateY(6*angulo);
  //texture(moon);
    fill('blue');
  sphere(radiusMoon/2);

  pop();

  let xSol = map(lonlocs, -180, +180, -width / 2, width / 2);

  let ySol = map(Decs, 90, -90, -height / 2, height / 2);
  
  let userX = map(userLong, -180, +180, -width / 2, width / 2);

  let userY = map(userLat, 90, -90, -height / 2, height / 2);
  createP(userX);
  createP(userY);
  push()
  translate(xSol, ySol, 15);
  //rotateY(6*angulo);
  //texture(sol);
 fill('yellow');
 sphere(radiusMoon);
 pop();
 //
 push();
 translate(userX, userY,5);
 fill(255,255,255,30);
 sphere(10);
  pop();
  
  //sol virtual===
  
    //== do outro lado - recente
  push();
  console.log('before', xSol, ySol);
  if (xSol > 0) {
    xSol = xSol - width / 2;
  } else {
    xSol = width / 2 + xSol;
  }
  ySol = -ySol;
  console.log('after', xSol, ySol);
  console.log(height / 2, width / 2);
  translate(xSol, ySol, 5);

  //rotateY(6*angulo);
  //texture(sol);
  fill('yellow');
  sphere(radiusMoon/2);
  pop();
  ///===
if(OntemHoje == "Hoje"){
console.log('dentro do loop, ontemhoje = ', OntemHoje);
  for (var j = total; j > -1; j--) {
    let yylat = map(latsys[j], 90, -90, -height / 2, height / 2, true);
    let xlong = map(long[j], -180, 180, -width / 2, width / 2, true);
    
    push();  
    if (Mag[j] > 3) {
      fill(255, 0, 0, 225);
      translate(xlong, yylat);
    } else {
      fill(0, 255, 0, 150)
    }
    rotateX(1.5);
    cylinder(nn * Mag[j], 5);
    pop();
    push();
      if(Mag[j] > 3.5){
        fill(0,0,0);
        textFont(myFont);
        textSize(13);
        text(Mag[j], xlong-9, yylat-5,100,50);
      }
    pop();
  } //for
  } //if ontemhoje
  if (nn > 2) {
    nn--;
  } else {
    nn++;
  }
  h4.html('Declinacao da Lua : ' + Dec);
  h11.html('Declinacao do Sol: ' + Decs);
} //draw
console.log('OntemHoje = ' + OntemHoje);

function tempo() {
  currentTime = new Date();
  dia = currentTime.getDate();
  hours = currentTime.getHours();
  minutes = currentTime.getMinutes();
  seconds = currentTime.getSeconds();
  mes = currentTime.getMonth() + 1;
  ano = currentTime.getFullYear();
  tempoNodia = (hours * 3600 + minutes * 60 + seconds) / 3600;
  TZ = currentTime.getTimezoneOffset() / 60;
  UT = tempoNodia + TZ;
  console.log('TZ = ' + TZ + ',  UT = ' + UT);
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

function mousePressed() {
  width = width/1.2;
  height = height/1.2;
  return false;
}

//

//************** FUNCTIONS ****************

//
//======function Moon =======
function Moon() {

  Nm = FNrange((125.1228 - 0.0529538083 * d) * rads); //Long ascending node
  im = 5.1454 * rads; // inclination of orbit 
  wm = FNrange((318.0634 + 0.1643573223 * d) * rads); //argm of periapsis
  ws = FNrange((282.9404 + 4.70935e-5 * d) * rads);
  am = 60.2666 //semi-major axis (Earth radii)
  as = 1; //(AU)
  ecm = 0.0549 * rads;
  ecs = (0.016709 - 1.151E-9 * d) * rads; //
  Mm = FNrange((115.3654 + 13.0649929509 * d) * rads); // mean anomaly
  Ms = FNrange((356.0470 + 0.9856002585 * d) * rads);
  Em = Mm + ecm * sin(Mm) * (1 + ecm * cos(Mm)); //eccentric anomaly
  //console.log('Em = ', Em, Em * degs)
  Es = Ms + ecs * sin(Ms) * (1 + ecs * cos(Ms));
  // me = ne * d + Le - we; //earth

  //True anomaly for Moon 
  xv = am * (cos(Em) - ecm);
  yv = am * (sqrt(1 - ecm * ecm) * sin(Em));
  console.log('xv, yv = ', xv, yv)
  vm = FNrange(atan2(yv, xv));
  // Finding the radius vector of the planet
  rm = sqrt(xv * xv + yv * yv);
  //console.log('vm, vm_deg rm = ', vm, vm * degs, rm);
  //These were the the moons position on the plane of
  //its orbit
  //Now,  convert to eclipitic coordinates


  //True anomaly for Sun 
  xvs = as * (cos(Es) - ecs);
  yvs = as * (sqrt(1 - ecs * ecs) * sin(Es));
  vs = atan2(yvs, xvs);
  // Finding the radius vector of the planet
  rs = sqrt(xvs * xvs + yvs * yvs);
  console.log('xvs,yvs,vs = ', xvs, yvs, vs);
  //moon's true longitude
  lonmoon = vm + wm;
  // Sun's true longitude
  lonsun = vs + ws;
  console.log(' lonsun degs = ', lonsun * degs);

  //horizontal cartesian geocentric coordinates
  //
  xeclip = rm * (cos(Nm) * cos(vm + wm) - sin(Nm) * sin(vm + wm) * cos(im));
  yeclip = rm * (sin(Nm) * cos(vm + wm) + cos(Nm) * sin(vm + wm) * cos(im));
  zeclip = rm * (sin(vm + wm) * sin(im));
  console.log('xeclip, yeclip, zeclip: ', xeclip, yeclip, zeclip);
  //   moons geocentric long and lat
  lon = atan2(yeclip, xeclip); //
  lat = atan2(zeclip, sqrt(xeclip * xeclip + yeclip * yeclip));
  console.log('Moon lon, lat DEGS = ', lon * degs, lat * degs);
  //perturbations - skipping them
  //
  //Moon's topocentric position

  Ls = Ms + ws; //Mean Longitude of the Sun  (Ns=0)
  Lm = Mm + wm + Nm; //Mean longitude of the Moon
  dm = Lm - Ls; // 'Mean elongation of the Moon
  F = Lm - Nm; //Argument of latitude for the Moon
  console.log('Mean Longitude of the MOON : ', Lm);
  //
  //   distance terms earth radii
  rm = rm - 0.58 * cos(Mm - 2 * dm);
  rm = rm - 0.46 * cos(2 * dm);
  //   next find the cartesian coordinates
  //   of the geocentric lunar position
  xg = rm * cos(lon) * cos(lat);
  yg = rm * sin(lon) * cos(lat);
  zg = rm * sin(lat);


  //for the sun
  xs = rs * cos(lonsun);
  ys = rs * sin(lonsun);
  console.log('xs, ys = ', xs, ys);
  //   rotate to equatorial coords
  //   obliquity of ecliptic of date
  ecl = (23.4393 - 3.563E-07 * d) * rads;
  console.log('ecl = ', ecl * degs);
  xe = xg;
  ye = yg * cos(ecl) - zg * sin(ecl);
  ze = yg * sin(ecl) + zg * cos(ecl); //   moons geocentric long and lat
  lon = atan2(yeclip, xeclip); //
  lat = atan2(zeclip, sqrt(xeclip * xeclip + yeclip * yeclip));
  console.log('Moon lon, lat DEGS = ', lon * degs, lat * degs);
  // 
  // for sun
  xes = xs;
  yes = ys * cos(ecl);
  zes = ys * sin(ecl);
  console.log('xes, yes, zes = ', xes, yes, zes);
  //   geocentric RA and Dec
  ra = atan2(ye, xe);
  dec = atan(ze / sqrt(xe * xe + ye * ye));
  ras = atan2(yes, xes);
  decs = atan(zes / sqrt(xes * xes + yes * yes));
  console.log('SOL  ras, decs = ', ras, decs);


  LsHour = Ls * degs / 15;
  LmHour = Lm * degs / 15;

  while (LsHour > 24) {
    LsHour -= 24;
  }
  while (LsHour < 0) {
    LsHour += 24;
  }
  GMST0 = LsHour - 12;
  GMST = GMST0 + UT;
  console.log('GMST0 =');
  console.log('GMST =', GMST);
  console.log('LsHour = ', LsHour);
  console.log('LmHour = ', LmHour)

  RA = ra * degs / 15;
  Dec = dec * degs;
  console.log(' Verificação : Dec = ', Dec);
  RAs = ras * degs / 15;
  if (RAs < 0) {
    RAs += 24;
  }

  Decs = decs * degs;
  lonloc = (RA - GMST) * 15;
  lonlocs = (RAs - GMST) * 15;
  console.log('464-RA, Dec (sun), UT =', RAs, Decs, UT);
  console.log('464-RA, Dec (moon), UT =', RA, Dec, UT);
  //
  while (lonloc < -180) {
    lonloc += 360;
    //console.log(lonloc);
  }
  while (lonloc > 180) {
    lonloc -= 360;
    //console.log(lonloc);
  }

  //
  while (lonlocs < -180) {
    lonlocs += 360;
    //console.log(lonloc);
  }
  while (lonlocs > 180) {
    lonlocs -= 360;
    //console.log(lonloc);
  }

  console.log('longitude of moon overhead = ', lonloc);
  console.log('longitude of sun overhead = ', lonlocs);
  //END//convert angles to first loop, degrees

} //end function Moon
//
//
function rev(angle) { //convert angles to first loop, degrees
  while (angle > 360) {
    angle -= 360;
  }
  while (angle < -360) {
    angle += 360;
  }
  return angle;
} ///end function rev    

//
//   Get the days to between a given date and today.  // the given date is the date of the orbital eleMents
// 
function numeroDeDias() {

  let now = (new Date()).getTime();
  let stampj2001 = (new Date('1999-12-31T00:00:00Z')).getTime();
  //time for calculation date:
  //
  let epoca = (now - stampj2001) / 1000;
  //console.log('epoca = ' + epoca);
  let numdias = epoca / 86400;
  console.log('numero de dias entre 2000-01-01 e agora = ' + numdias); //incluir frações do dia, depois: dayfrac = hours+ min/60)/24
  //calculatin UT time, decimal hours
  now = new Date();
  minutes = now.getUTCMinutes() / 60;
  seconds = now.getUTCSeconds() / 360;
  hours = now.getUTCHours();
  UT = hours + minutes + seconds;
  console.log('522-UT', UT);
  return numdias;
} //end function numeroDeDias
//****************************FNRANGE
//   the function below returns an angle in the range
//   0 to two pi
//
function FNrange(x) {
  //console.log('x = ' + x);
  b = x / twopi;
  //console.log('int(b) =', int(b));
  aa = x - twopi * int(b); // 
  //console.log('x, aa, b, dentro de range = ', x, aa, b);
  if (aa < 0) {
    //console.log('aa less than zero');
    //console.log('twopi + aa = ' + (twopi + aa));
    return (twopi + aa);
  } else {
    return aa;
  }
} //end FNrange
