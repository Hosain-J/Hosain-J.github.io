// sketch.js

let mg;

function preload() {
  mg = new MapGenerator({
    cols: 20,
    rows: 14,
    tileSize: 64,
    bgCount: 47,
    wallCount: 47,
    decCount: 20,
  });
  mg.preload();
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  mg.setup();
}

function draw() {
  mg.draw();
}

function mousePressed() {
  mg.mousePressed();
}
