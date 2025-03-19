// Game No. 2
// Hosian Javadi
// March 12, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let cat;
let miceGroup=[];

function setup() {
  createCanvas(windowWidth, windowHeight);
  spawnCat();
}

function draw() {
  background(220);
  moveCat();
}

function spawnCat(catX, catY, catW, catH){
  let cat = {
    x:catX,
    y:catY,
    w:catW,
    h:catH,
    directionX:1,
    directionY:1,
    speed:5,
    catSize:20,
  };
}

function spawnMice(miceX, miceY, miceW, miceH){
  let mice = {
    x:miceX,
    y:miceY,
    w:miceW,
    h:miceH,
  };
  miceGroup.push(mice);
}

function randomizedMovement(){

}
function moveCat(){
  if (keyIsDown(LEFT_ARROW)){
    cat.x 
  }
}