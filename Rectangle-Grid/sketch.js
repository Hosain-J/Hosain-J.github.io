// grid

const cellSize =50;
let grid, rows, cols;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.floor(width/cellSize);
  rows = Math.floor(height/cellSize);
  grid = generateRandomGrid(cols, rows);
}

function draw() {
  background(220);
  displayGrid();
}

function displayGrid(){
  for (let y=0; y<rows;y++){
    for (let x=0; x<cols;x++){
      if (grid[y][x]===0){
        fill("white");
      }
      else if(grid[y][x]===1){
        fill("black");
      }
    }
  }
}

function generateRandomGrid(cols,rows){
  let newGrid=[];
  for (let y=0;y<rows;y++){
    newGrid.push([]);
    for (let x=0;x<cols;x++){
      if (random(100)<50){
        newGrid[y].push(0);
      }
      else{
        newGrid[y].push(1);
      }
    }
  }
  return newGrid;
}