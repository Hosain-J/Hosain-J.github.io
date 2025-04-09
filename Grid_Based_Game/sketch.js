// Block Puzzle Game - Drag and Drop
// Endless Game Until No Valid Moves
// Hosain Javadi
// April 5th,2025
//
// Extra for Expert:
// I have added HTML Div to the code for Game Over pop up window. I hav added a 

let grid; //initializing the gird
const gridSize=9; // how many square the grid contains
let cellSize;  // cell size
let shapes=[]; // an array to store(push) the shapes to generate.
let currentPieces=[]; // an array to store what shapes have been generated for the player
let score=0; // score
let clearingEffects=[]; // an array that store animation information into it
let gridOffsetX,gridOffsetY; // to put the grid at the center of the web page
let darkMode=false; // var to check the dark mode
let toggleButton; // var for button of Light Dark Mode 
let gameOverDiv; // var for Game Over pop up window
let gameIsOver=false; // var to check if the game is over or not

function setup() {
  createCanvas(windowWidth,windowHeight);
  cellSize=min(width,height) / (gridSize + 6); // calculating the cell size
  gridOffsetX=(width - gridSize * cellSize) / 2; // putting the grid horizontally at the center
  gridOffsetY=(height - gridSize * cellSize) / 2 - cellSize; // putting the grid vertically at the center(slightly upwards)
  grid=createEmptyGrid(); // making a base grid
  generateNewPieces();

  toggleButton=createButton("Light/Dark MODE"); // Create a button to toggle
  toggleButton.position(20,60); // place the button on cthe page
  // when the button is preesed inverts dark mode
  toggleButton.mousePressed(() => {
    darkMode=!darkMode;
  });

  // Create the GameOver popup window using HTML and adding a button to refresh the page
  gameOverDiv=createDiv(`
    <div style="
      background: rgba(0,0,0,0.8);
      color: white;
      font-size: 24px;
      text-align: center;
      padding: 40px;
      border-radius: 12px;
      width: 300px;
      margin: 0 auto;
    ">
      <p>Game Over! Final Score: <span id="final-score"></span></p>
      <button id="restart-btn" style="
        padding: 10px 20px;
        font-size: 18px;
        margin-top: 20px;
        cursor: pointer;
      ">Restart</button>
    </div>
  `);
  // place the the popup window at the center
  gameOverDiv.position((windowWidth - 300) / 2,(windowHeight - 200) / 2);
  gameOverDiv.hide(); // hide the window unless the game is over
}

function draw() {
  background(darkMode ? 30 : 240); // set the color based on dark mode,using ternary
  // calling functions
  drawScore();
  drawGrid();
  drawEffects();
  drawPieces();

  // check if the game is over
  if (!gameIsOver && !anyValidMoves()) {
    gameIsOver=true;
    noLoop();
    select("#final-score").html(score); // update the score on html popup wiindow
    gameOverDiv.show(); // dispaly the window

    select("#restart-btn").mousePressed(() => {
      location.reload(); // refresh the webpage
    });
  }
}

function createEmptyGrid() {
  let g=[]; // empty array and make the grid
  for (let y=0; y < gridSize; y++) {
    g[y]=[];
    for (let x=0; x < gridSize; x++) {
      g[y][x]=0;
    }
  }
  return g;
}

function drawGrid() {
  stroke(180); // border
  for (let y=0; y < gridSize; y++) {
    for (let x=0; x < gridSize; x++) {
      if (grid[y][x] === 1) { // if full light blue,using lerpcolor() to blend white and blue colors
        fill(lerpColor(color(255),color(80,180,255),0.6));
      } 
      else {// if empty white or dark grey based on dark mode
        fill(darkMode ? 50 : 255);
      }
      // make the rects for each cell
      rect(gridOffsetX + x * cellSize,gridOffsetY + y * cellSize,cellSize,cellSize);
    }
  }
}

function drawScore() {
  fill(darkMode ? 255 : 0); // again ternary,text modification based on dark mode
  textSize(24);
  textAlign(LEFT,TOP);
  text("Score: " + score,20,20);
}

function drawPieces() { // loops through each piece to call its display function
  for (let piece of currentPieces) {
    piece.display();
  }
}

function drawEffects() { // loop through the clearingEffect array backwards for the index efficiancy. the function make a yellow cells for the rows or columns that have been cleared. just make the game fancier
  for (let i=clearingEffects.length - 1; i >= 0; i--) {
    let effect=clearingEffects[i];
    effect.alpha -= 10;
    if (effect.alpha <= 0) {
      clearingEffects.splice(i,1);
      continue;
    }
    fill(255,255,0,effect.alpha);
    noStroke();
    rect(gridOffsetX + effect.x * cellSize,gridOffsetY + effect.y * cellSize,cellSize,cellSize); //make the rects in the position where the rects have to get cleared
  }
}

function mousePressed() { // mouse clicking event
  if (gameIsOver) {
    return;
  }
  for (let piece of currentPieces) {
    piece.startDrag(mouseX,mouseY); // call the function for dragging the blocks
  }
}

function mouseDragged() { // if the mouse moves the blocks follow
  if (gameIsOver) {
    return;
  }
  for (let piece of currentPieces) {
    piece.drag(mouseX,mouseY);
  }
}

function mouseReleased() { // when the mouse is release if the block can fit in the grid,then it'll be placed to the nearest. then function for checking if any lines has to be cleared will be called
  if (gameIsOver) {
    return;
  }
  for (let i=currentPieces.length - 1; i >= 0; i--) {
    if (currentPieces[i].drop(grid,cellSize)) {
      currentPieces.splice(i,1);
      checkLines();
    }
  }

  if (currentPieces.length === 0) { // if there is no more piece it generates three new pieces
    generateNewPieces();
  }
}

function checkLines() { // check for clearing rows or columns,the func make two empty array so it can push the info of the cells that have to be erased into them,then it clears them
  let toClearRows=[];
  let toClearCols=[];

  for (let y=0; y < gridSize; y++) {
    if (grid[y].every(cell => cell === 1)) {
      toClearRows.push(y);
    }
  }

  for (let x=0; x < gridSize; x++) {
    let full=true;
    for (let y=0; y < gridSize; y++) {
      if (grid[y][x] === 0) {
        full=false;
      }
    }
    if (full) {
      toClearCols.push(x);
    }
  }

  for (let y of toClearRows) {
    for (let x=0; x < gridSize; x++) {
      grid[y][x]=0;
      score++;
      clearingEffects.push({ x: x,y: y,alpha: 255 });
    }
  }

  for (let x of toClearCols) {
    for (let y=0; y < gridSize; y++) {
      grid[y][x]=0;
      score++;
      clearingEffects.push({ x: x,y: y,alpha: 255 });
    }
  }
}

function generateNewPieces() { // generating blocks
  currentPieces=[];
  // block size modification
  const spacing=cellSize * (gridSize / 3);
  const startX=gridOffsetX + (cellSize * gridSize - spacing * 2) / 2;
  const baseY=gridOffsetY + cellSize * gridSize + cellSize;

  for (let i=0; i < 3; i++) { // it pushes the new blocks to the current peices set
    let shape=randomShape();
    let pieceX=startX + i * spacing;
    let pieceY=baseY;
    currentPieces.push(new Block(shape,pieceX,pieceY));
  }
}

function anyValidMoves() { // the function checks if there is anymore space for the blocks to be placed in the grid if not the Game Over page would popup. one more thing is it does not just check the current angle of the block. it check for all the angle possible which are 4 for each piece
  for (let piece of currentPieces) {
    const originalShape=piece.shape;

    for (let r=0; r < 4; r++) {
      if (piece.canFit(grid)) {
        return true;
      }
      const oldShape=piece.shape;
      const rows=oldShape.length;
      const cols=oldShape[0].length;
      const newShape=[];
      for (let x=0; x < cols; x++) {
        newShape[x]=[];
        for (let y=rows - 1; y >= 0; y--) {
          newShape[x][rows - 1 - y]=oldShape[y][x];
        }
      }
      piece.shape=newShape;
    }
    piece.shape=originalShape;
  }
  return false;
}

function randomShape() {
  const shapeTemplates=[
    [[1,1,1],[0,1,0],[0,1,0]],
    [[1,1],[1,1]],
    [[1,0],[1,1]],
    [[1,1,1],[0,1,0]],
    [[1,1,1]],
    [[1,1,1,1]],
    [[1,1,1],[1,0,0]],
    [[1,1],[0,1]],
    [[1,0],[0,1]]
  ];
  return random(shapeTemplates);
}

class Block {
  constructor(shape,x,y) {
    this.shape=shape;
    this.x=x;
    this.y=y;
    this.dragging=false;
    this.offsetX=0;
    this.offsetY=0;
    this.color=color(random(180,255),random(180,255),random(180,255));
    this.currentAngle=0;
    this.targetAngle=0;
    this.rotationQueue=[];
    this.rotationCount=0;
  }

  display() {
    push();
    translate(this.x + this.getWidth() / 2,this.y + this.getHeight() / 2);
    rotate(this.currentAngle);
    translate(-this.getWidth() / 2,-this.getHeight() / 2);

    fill(this.color);
    stroke(darkMode ? 20 : 200);
    strokeWeight(1);
    for (let row=0; row < this.shape.length; row++) {
      for (let col=0; col < this.shape[0].length; col++) {
        if (this.shape[row][col]) {
          rect(col * cellSize,row * cellSize,cellSize,cellSize);
        }
      }
    }
    pop();

    if (abs(this.targetAngle - this.currentAngle)>0.01) {
      this.currentAngle=lerp(this.currentAngle,this.targetAngle,0.2);
    } 
    else {
      this.currentAngle=this.targetAngle;
      if (this.rotationQueue.length>0) {
        const apply=this.rotationQueue.shift();
        apply();
        this.currentAngle=0;
        this.targetAngle=0;
      }
    }
  }

  rotate() {
    if (this.rotationQueue.length === 0 && this.currentAngle === this.targetAngle) {
      this.targetAngle += HALF_PI;
      const oldShape=this.shape;
      this.rotationQueue.push(() => {
        const newShape=[];
        const rows=oldShape.length;
        const cols=oldShape[0].length;
        for (let x=0; x < cols; x++) {
          newShape[x]=[];
          for (let y=rows - 1; y >= 0; y--) {
            newShape[x][rows - 1 - y]=oldShape[y][x];
          }
        }
        this.shape=newShape;
      });
    }
  }

  startDrag(mx,my) {
    if (this.isMouseOver(mx,my)) {
      this.dragging=true;
      this.offsetX=mx - this.x;
      this.offsetY=my - this.y;
    }
  }

  drag(mx,my) {
    if (this.dragging) {
      this.x=mx - this.offsetX;
      this.y=my - this.offsetY;
    }
  }

  drop(grid,cellSize) {
    if (!this.dragging) {
      return false;
    }
    this.dragging=false;

    let gx=Math.round((this.x - gridOffsetX) / cellSize);
    let gy=Math.round((this.y - gridOffsetY) / cellSize);

    if (this.canPlaceAt(grid,gx,gy)) {
      for (let row=0; row < this.shape.length; row++) {
        for (let col=0; col < this.shape[0].length; col++) {
          if (this.shape[row][col]) {
            grid[gy + row][gx + col]=1;
          }
        }
      }
      return true;
    }
    return false;
  }

  canPlaceAt(grid,gx,gy) {
    for (let row=0; row < this.shape.length; row++) {
      for (let col=0; col < this.shape[0].length; col++) {
        if (this.shape[row][col]) {
          if (gy + row < 0 || gy + row >= gridSize || gx + col < 0 || gx + col >= gridSize) {
            return false;
          }
          if (grid[gy + row][gx + col] === 1) {
            return false;
          }
        }
      }
    }
    return true;
  }

  canFit(grid) {
    for (let y=0; y <= gridSize - this.shape.length; y++) {
      for (let x=0; x <= gridSize - this.shape[0].length; x++) {
        if (this.canPlaceAt(grid,x,y)) {
          return true;
        }
      }
    }
    return false;
  }

  isMouseOver(mx,my) {
    return mx>this.x && mx < this.x + this.shape[0].length * cellSize &&
           my>this.y && my < this.y + this.shape.length * cellSize;
  }

  getWidth() {
    return this.shape[0].length * cellSize;
  }

  getHeight() {
    return this.shape.length * cellSize;
  }
}

function keyPressed() {
  if (gameIsOver) {
    return;
  }
  if (key === 'r' || key === 'R') {
    for (let piece of currentPieces) {
      if (piece.dragging || piece.isMouseOver(mouseX,mouseY)) {
        piece.rotate();
        break;
      }
    }
  }
}

// function windowResized(){
//   resizeCanvas(windowWidth,windowHeight);
// }
