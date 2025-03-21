// 2d grid demo

// let grid = [[0,1,1,0],
//             [1,1,0,0],
//             [0,0,1,1],
//             [0,1,0,0]];

// const cellSize = 50; // do this for choosing a size for the boxes
let cellSize;
const squareDimension=10;
let grid;

function setup() {
  createCanvas(windowWidth, windowHeight);

  if (height>width){
    cellSize = width/squareDimension;
  }
  else{
    cellSize = height/squareDimension;
  }

  grid=randomGenrateGrid(squareDimension,squareDimension);
}

function draw() {
  background(220);

  displayGrid();
}

function displayGrid(){
  for (let y =0; y<squareDimension;y++){
    for (let x=0;x<squareDimension;x++){
      if (grid[y][x]===0){
        fill('black');
      }
      else if (grid[y][x]===1){
        fill('white');
      }
      rect(x*cellSize,y*cellSize,cellSize,cellSize);
    }
  }
}

function genrateGrid(cols,rows){
  let newGrid = [];
  for (let y=0;y<rows;y++){
    newGrid.push([]);
    for (let x=0;x<cols;x++){
      newGrid[y].push(0);
    }
  }
  return newGrid;
}

function randomGenrateGrid(cols,rows){
  let newGrid = [];
  for (let y=0;y<rows;y++){
    newGrid.push([]);
    for (let x=0;x<cols;x++){
      if (random(100)<50){
        newGrid[y].pudh(1);
      }
      else {
        newGrid[y].push(0);
      }
    }
  }
  return newGrid;
}