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
  background: 0,
  gui: true,
  mode: 'canvas', // canvas or svg … SVG mode is experimental 
};
getCanvasHolderSize();
let sumParams= [];

// Params for the drawing
const drawingParams = {


// params for the circle of lines
linesAmount:26,
linesAmountMax:70,
linesAmountMin:9,

innerRadius : 100,
innerRadiusMin: 0,
innerRadiusMax: 100,

outerRadius : 130,
outerRadiusMin: 100,
outerRadiusMax: 180,

alpha: 100,
alphaMin: 0,
alphaMax: 200,

alphaBg: 100,
alphaBgMin: 20,
alphaBgMax: 100,

preset: ['dots', 'triangles'],

};



// Params for logging
const loggingParams = {
  targetDrawingParams: document.getElementById('drawingParams'),
  targetCanvasParams: document.getElementById('canvasParams'),
  state: false
};



//defined variables
let point1;
let point2;
let point3;
let angle;
rotateIndex = 0;
let angleSteps = 360/drawingParams.linesAmount;
let currentPreset = false;
//let createGui; 
let sketchGUI;



/* ###########################################################################
Classes
############################################################################ */
/* ###########################################################################
Custom Functions
############################################################################ */

function crosshairs(){
  strokeWeight(1);
  stroke(0,0,0,50);
  stroke(100);
  line(width/2,0,width/2,height);
  line(0,height/2,width, height/2);
}

// compares the amount of newly added lines and pushes new coordinates of dots into the array

function nullifyArray(){
sumParams=[];
}

// function with everything ??? might need to be devived 

function drawLinesInCircle(){
alphaBg=drawingParams.alphaBg;
  const innerRadius = drawingParams.innerRadius;
  const outerRadius = drawingParams.outerRadius;


  stroke(0)
 translate (width/2, height/2);
 background(255,alphaBg);
 

// defining the coordinates for the round formation of lines

  for (let angle =0; angle <360; angle+=angleSteps){ 
    const x1= cos(angle)* innerRadius;
    const y1 = sin(angle)*innerRadius;
    const x2= cos(angle)* outerRadius;
    const y2 = sin(angle)*outerRadius;

  
    stroke(201, 198, 172,alpha);
    strokeWeight(1);
    line(x1,y1, x2,y2);

    let a= (x1+x2)/2; // saves the coordinates of the dots, which are the vertexes of the triangle 
    let b= (y1+y2)/2;

    sumParams.push({a,b}); // pushes the coordinates into the array 

    fill(255);
  }   
}

function rotateTriangle(){

  const alpha = drawingParams.alpha;
// attempts to find the sequence in placing the vertexes 

let arrayStep = Math.floor(drawingParams.linesAmount/3);
console.log(arrayStep);

point1= sumParams[0];
point2= sumParams[arrayStep];
point3 = sumParams[2*arrayStep+1];


let linesAmount= drawingParams.linesAmount;


//animation of the triangle

rotate (rotateIndex); 
rotateIndex = rotateIndex+ angleSteps;

strokeWeight(5);
stroke(93, 138, 168,alpha);
line(point1.a, point1.b, point3.a, point3.b);
stroke(188, 212, 230,alpha);
line(point1.a, point1.b, point2.a, point2.b);
stroke(204, 204, 255, alpha);
line(point2.a, point2.b, point3.a, point3.b);

noStroke();
for(i=0; i<360; i++){
fill(93, 138, 168,200);
circle(point1.a, point1.b,10);


fill(188, 212, 230,200);
circle(point2.a, point2.b,10);


fill(204, 204, 255, 200);
circle(point3.a, point3.b,10);

}

}


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
  angleMode(DEGREES);
  smooth();
  // GUI Management
  if (canvasParams.gui) { 
    sketchGUI = createGui('Params');
    sketchGUI.addObject(drawingParams);
    //noLoop();
  }
  // Anything else
  fill(200);
  stroke(0);
  frameRate(3);
}



function draw() {

  /* ----------------------------------------------------------------------- */
  // Log globals
  if (!canvasParams.mouseLock) {
    canvasParams.mouseX = mouseX;
    canvasParams.mouseY = mouseY;
    logInfo();
  }
  /* ----------------------------------------------------------------------- */
  // Provide your Code below
  background(255, 255,255, drawingParams.alphaBg);
    if (drawingParams.preset !== currentPreset) { 
   currentPreset = drawingParams.preset;
   if (drawingParams.preset === 'dots') { 
     sketchGUI.update('linesAmount', 70);
     sketchGUI.update('innerRadius', 100);
     sketchGUI.update('outerRadius', 180);
     sketchGUI.update('alpha', 0);
     sketchGUI.update('alphaBg', 20);
   } else if (drawingParams.preset === 'triangles') { 
    sketchGUI.update('linesAmount', 70);
    sketchGUI.update('innerRadius', 100);
    sketchGUI.update('outerRadius', 180);
    sketchGUI.update('alpha', 200);
    sketchGUI.update('alphaBg', 20);
   }
 }
  if(sumParams.length!=drawingParams.linesAmount){
    rotateIndex=0;
  }
  nullifyArray();

  angleSteps = 360/drawingParams.linesAmount;
  drawLinesInCircle();
  rotateTriangle();
 
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

function mousePressed() {
}
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

