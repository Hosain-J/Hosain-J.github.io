// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// Perlin Noise Demo
// moving ball

let timex=0;
let timey=1000;
let deltaTime=0.01;
let x;
let y;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  fill('black');
  x=noise(timex)*width;
  y=noise(timey)*height;
  circle(x,y,50);

  timex+=deltaTime;
  timey+=deltaTime;
}
