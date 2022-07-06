// Global Constants
const fieldSize = 1024;
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

function setup() {

  createCanvas(fieldSize, fieldSize);
  background(72, 70, 170); // Cobalt background
  smooth();
  noFill();
  noStroke();
  ellipseMode(RADIUS);
  strokeWeight(defaultStrokeWeight);

  container = document.getElementsByTagName("main")[0];
  p5Canvas = document.getElementById("defaultCanvas0"); // Automatically assigned by P5js
  postProcessLayer = document.getElementById("post-processor");
  ppContext = postProcessLayer.getContext("2d");
  ppContext.antiAlias = true;

  drawingContext.powerPreference = "high-performance";

  chromaticAberrationPhase = 2;
  chromaticAberrationStrength = 3;
  xCenter = width / 2;
  yCenter = height / 2;

  // Add post-processing canvas
  postProcessLayer.width = width;
  postProcessLayer.height = height;
}

function draw() {

  // Always keep the line below
  applyPostProcess();
}

/* --------------------------------------------------------------------------------------------------------------------------- */