// Global Constants
const fieldSize = 1080;
let container;
let p5Canvas;
let postProcessLayer;
let ppContext;
const spirographs = [];
const defaultStrokeWeight = 0.25;

// For line styles
const DASHED = [2, 4];
const SOLID = [0];

// Controller variables
var chromaticAberrationPhase;
var chromaticAberrationStrength;
var xCenter;
var yCenter;

var radius;
var angle;
var step;

function setup() {

  createCanvas(fieldSize, fieldSize);
  background(72, 70, 170); // Cobalt background
  smooth();
  noFill();
  noStroke();
  ellipseMode(RADIUS);
  strokeWeight(defaultStrokeWeight);
  // noLoop(); // Disables frame rate after one draw cycle
  // scale(width, height); // sets coordinate system to pecentage-based

  container = document.getElementsByTagName("main")[0];
  p5Canvas = document.getElementById("defaultCanvas0"); // Automatically assigned by P5js
  postProcessLayer = document.getElementById("post-processor");
  ppContext = postProcessLayer.getContext("2d");
  ppContext.antiAlias = true;

  drawingContext.powerPreference = "high-performance";
  // drawingContext.setLineDash(SOLID);

  const GUI = createGui(':: INTERFACE ::');

  chromaticAberrationPhase = 2;
  chromaticAberrationStrength = 3;
  xCenter = width / 2;
  yCenter = height / 2;

  radius = 32;
  angle = 0;
  stepFactor = 8;
  step = TWO_PI / stepFactor; //in radians equivalent of 360/6 in degrees

  GUI.addGlobals(
    'width',
    'height',
    'xCenter',
    'yCenter',
    'radius',
    'angle',
    'chromaticAberrationPhase',
    'chromaticAberrationStrength'
  );

  // Add our post-processing canvas
  postProcessLayer.width = width;
  postProcessLayer.height = height;
  colorMode(RGB);

  noFill();
  stroke(255);
  strokeWeight(3);

  drawGlyph(xCenter, yCenter, 32);
}

function draw() {

  // Always keep the line below
  applyPostProcess();
}

/* --------------------------------------------------------------------------------------------------------------------------- */



/*
// TURTLE STUFF:
let x, y; // the current position of the turtle
let currentangle = 0; // which way the turtle is pointing
let step = 20; // how much the turtle moves with each 'F'
let angle = 90; // how much the turtle turns with a '-' or '+'

// LINDENMAYER STUFF (L-SYSTEMS)
let thestring = 'A'; // "axiom" or start of the string
let numloops = 5; // how many iterations to pre-compute
let therules = []; // array for rules
therules[0] = ['A', '-BF+AFA+FB-']; // first rule
therules[1] = ['B', '+AF-BFB-FA+']; // second rule

let whereinstring = 0; // where in the L-system are we?

function setup() {
  createCanvas(710, 400);
  background(255);
  stroke(0, 0, 0, 255);

  // start the x and y position at lower-left corner
  x = 0;
  y = height-1;

  // COMPUTE THE L-SYSTEM
  for (let i = 0; i < numloops; i++) {
    thestring = lindenmayer(thestring);
  }
}

function draw() {

  // draw the current character in the string:
  drawIt(thestring[whereinstring]);

  // increment the point for where we're reading the string.
  // wrap around at the end.
  whereinstring++;
  if (whereinstring > thestring.length-1) whereinstring = 0;

}

// interpret an L-system
function lindenmayer(s) {
  let outputstring = ''; // start a blank output string

  // iterate through 'therules' looking for symbol matches:
  for (let i = 0; i < s.length; i++) {
    let ismatch = 0; // by default, no match
    for (let j = 0; j < therules.length; j++) {
      if (s[i] == therules[j][0])  {
        outputstring += therules[j][1]; // write substitution
        ismatch = 1; // we have a match, so don't copy over symbol
        break; // get outta this for() loop
      }
    }
    // if nothing matches, just copy the symbol over.
    if (ismatch == 0) outputstring+= s[i];
  }

  return outputstring; // send out the modified string
}

// this is a custom function that draws turtle commands
function drawIt(k) {

  if (k=='F') { // draw forward
    // polar to cartesian based on step and currentangle:
    let x1 = x + step*cos(radians(currentangle));
    let y1 = y + step*sin(radians(currentangle));
    line(x, y, x1, y1); // connect the old and the new

    // update the turtle's position:
    x = x1;
    y = y1;
  } else if (k == '+') {
    currentangle += angle; // turn left
  } else if (k == '-') {
    currentangle -= angle; // turn right
  }

  // give me some random color values:
  let r = random(128, 255);
  let g = random(0, 192);
  let b = random(0, 50);
  let a = random(50, 100);

  // pick a gaussian (D&D) distribution for the radius:
  let radius = 0;
  radius += random(0, 15);
  radius += random(0, 15);
  radius += random(0, 15);
  radius = radius / 3;

  // draw the stuff:
  fill(r, g, b, a);
  ellipse(x, y, radius, radius);
}
*/