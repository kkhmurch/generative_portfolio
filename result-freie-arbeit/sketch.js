/*jshint esversion: 6 */

/* ############################################################################ 

Kurs «Generative Gestaltung» an der TH Köln
Christian Noss
christian.noss@th-koeln.de
https://twitter.com/cnoss
https://cnoss.github.io/generative-gestaltung/

############################################################################ */

const saveParams = {
  sketchName: "gg-sketch"
}

// Params for canvas
const canvasParams = {
  holder: document.getElementById('canvas'),
  state: false,
  mouseX: false,
  mouseY: false,
  mouseLock: false,
  gui: true,
  mode: 'canvas', // canvas or svg … SVG mode is experimental 
};
getCanvasHolderSize();

// Params for the drawing
const drawingParams = {


magnitude:1,
magnitudeMax: 5,
magnitudeMin: 0.1,

frameRate: 25,
frameRateMin:5,
frameRateMax: 60,

};

// Params for logging
const loggingParams = {
  targetDrawingParams: document.getElementById('drawingParams'),
  targetCanvasParams: document.getElementById('canvasParams'),
  state: false
};

// Definition// Initialisation

var inc=0.1;
var scl=50;
var zoff=0;
var particles= [];
var flowfield;
//var hue = 0;



/* ###########################################################################
Classes
############################################################################ */





/* ###########################################################################
Custom Functions
############################################################################ */





/* ###########################################################################
P5 Functions
############################################################################ */

function setup() {

  let canvas;
  if (canvasParams.mode === 'SVG') {
    canvas = createCanvas(canvasParams.w, canvasParams.h, SVG);
  } else { 
    canvas = createCanvas(canvasParams.w, canvasParams.h);
    canvas.parent("canvas");
  }

  // Display & Render Options
  //frameRate(25);
  windowResized();
  smooth();

  // GUI Management
  if (canvasParams.gui) { 
    const sketchGUI = createGui('Params');
    sketchGUI.addObject(drawingParams);
    //noLoop();
  }

  // Anything else
  colorMode(RGB,255,255,255);
  cols= Math.floor(width/scl);
  rows= Math.floor(height/scl);

  flowfield = new Array (cols*rows); //preset the size of the array

  for (var i=0; i<200; i++){
    particles[i]=new Particle ();
  }
}



function draw() {

  /* ----------------------------------------------------------------------- */
  // Log globals
  if (!canvasParams.mouseLock) {
    canvasParams.mouseX = mouseX;
    canvasParams.mouseY = mouseY;
    logInfo();
    windowResized();
  }

  /* ----------------------------------------------------------------------- */
  // Provide your Code below

frameRate(drawingParams.frameRate);
colorMode(HSB);
background(176,13,96, 80);
  var yoff=0;
  for(y=0; y<rows; y++){
    let xoff=0;  
    for(x=0; x<cols; x++){
      var index = x+y*cols;
      flowfield[index]=v;
      var angle= noise(xoff, yoff,zoff)*TWO_PI*4;
      var v=p5.Vector.fromAngle(angle);
      v.setMag(drawingParams.magnitude);
      xoff+=inc;
      stroke(0,100);
      push ();
      translate (x*scl, y*scl);
      rotate(v.heading());
      // strokeWeight(3);
      // stroke(150,50,40);
      // line (0, 0, scl, 0);
      pop ();

    }
    yoff+=inc;
    zoff +=0.0003;
}

for (var i=0; i<particles.length; i++){

  var step = 360/(particles.length);

  particles [i].follow (flowfield);
  particles [i].update ();
  particles [i].edges ();
  particles [i].show ();



}
}



function keyPressed() {

  if (keyCode === 81) { // Q-Key
  }

  if (keyCode === 87) { // W-Key
  }

  if (keyCode === 89) { // Y-Key
  }

  if (keyCode === 88) { // X-Key
  }

  if (keyCode === 83) { // S-Key
    const suffix = (canvasParams.mode === "canvas") ? '.jpg' : '.svg';
    const fragments = location.href.split(/\//).reverse();
    const suggestion = fragments[1] ? fragments[1] : 'gg-sketch';
    const fn = prompt(`Filename for ${suffix}`, suggestion);
    if (fn !== null) save(fn + suffix);
  }

  if (keyCode === 49) { // 1-Key
    windowResized();
  }

  if (keyCode === 50) { // 2-Key
  }

  if (keyCode === 76) { // L-Key
    if (!canvasParams.mouseLock) {
      canvasParams.mouseLock = true;
    } else { 
      canvasParams.mouseLock = false;
    }
    document.getElementById("canvas").classList.toggle("mouseLockActive");
  }


}




function mousePressed() {}



function mouseReleased() {}



function mouseDragged() {}



function keyReleased() {
  if (keyCode == DELETE || keyCode == BACKSPACE) clear();
}





/* ###########################################################################
Service Functions
############################################################################ */



function getCanvasHolderSize() {
  canvasParams.w = canvasParams.holder.clientWidth;
  canvasParams.h = canvasParams.holder.clientHeight;
}



function resizeMyCanvas() {
  getCanvasHolderSize();
  resizeCanvas(canvasParams.w, canvasParams.h);
}



function windowResized() {
  // Recalculate cols and rows based on the new width and height
  cols = Math.floor(width / scl);
  rows = Math.floor(height / scl);

  // Recreate the flow field or perform any other necessary adjustments
  flowfield = new Array(cols * rows);
  resizeMyCanvas();
}



function logInfo(content) {

  if (loggingParams.targetDrawingParams) {
    loggingParams.targetDrawingParams.innerHTML = helperPrettifyLogs(drawingParams);
  }

  if (loggingParams.targetCanvasParams) {
    loggingParams.targetCanvasParams.innerHTML = helperPrettifyLogs(canvasParams);
  }

}

