// sketch.js

// ───────────────────────────────────────────────────────
// 1. CONFIG & GLOBALS
// ───────────────────────────────────────────────────────
const cols     = 20;
const rows     = 14;
const tileSize = 64;

const bgCount   = 47;
const wallCount = 47;
const decCount  = 20;

let layers = {
  base:       Array.from({ length: rows },     () => Array(cols).fill(null)),
  decoration: Array.from({ length: rows },     () => Array(cols).fill(null)),
};

let images    = {};    // { filepath: p5.Image }
let bgPaths   = [];    // list of all background paths
let wallPaths = [];    // list of all wall paths
let decPaths  = [];    // list of all decoration paths

let fileInput;         // hidden <input type="file">
let walls;             // p5.play Group for wall colliders
let player;            // our King instance

// ───────────────────────────────────────────────────────
// 2. KING CLASS DEFINITION (merged here)
// ───────────────────────────────────────────────────────
class King {
  constructor() {
    this.isJumping = false;
    this.hitBox    = null;
    this.spi       = null;
  }

  pre() {
    // Create hitBox and visible sprite
    this.hitBox = new Sprite(0, 0, 45, 53);
    this.spi    = new Sprite(0, 0, 78, 58);

    // Assign spritesheet and animations
    this.spi.spriteSheet = 'asset/king_human_full.png';
    this.spi.addAnis({
      attack:  { row: 0, frames: 3,  frameDelay: 6  },
      dead:    { row: 1, frames: 4             },
      door_in: { row: 2, frames: 8,  frameDelay: 14 },
      door_out:{ row: 3, frames: 8,  frameDelay: 14 },
      fall:    { row: 4                    },
      ground:  { row: 5                    },
      hit:     { row: 6, frames: 2             },
      idle:    { row: 7, frames:11             },
      jump:    { row: 8                    },
      run:     { row: 9, frames: 8             }
    });
    this.spi.changeAni('idle');
    this.spi.anis.offset.y = 0;
    this.spi.rotationLock  = true;
    this.spi.collider      = 'NONE';
    this.spi.scale         = 1;

    this.hitBox.rotationLock = true;
    this.hitBox.visible      = true;

    allSprites.pixelPerfect = true;
  }

  respawn() {
    // center of the grid
    const gridW   = cols * tileSize;
    const gridH   = rows * tileSize;
    const offsetX = (width  - gridW) / 2;
    const offsetY = (height - gridH) / 2;

    this.hitBox.position.x = offsetX + gridW/2;
    this.hitBox.position.y = offsetY + gridH/2;
    this.isJumping = false;
  }

  handleInput() {
    // Horizontal
    if (keyIsDown(RIGHT_ARROW)) {
      this.hitBox.vel.x = 6;
      this.spi.mirror.x = false;
      this.spi.changeAni('run');
    }
    else if (keyIsDown(LEFT_ARROW)) {
      this.hitBox.vel.x = -6;
      this.spi.mirror.x = true;
      this.spi.changeAni('run');
    }
    else {
      this.hitBox.vel.x = 0;
      this.spi.changeAni('idle');
    }

    // Jump
    if (keyIsDown(UP_ARROW) && !this.isJumping) {
      this.hitBox.vel.y = -6;
      this.isJumping = true;
    }

    // Aerial animations
    if (this.hitBox.vel.y < 0) {
      this.spi.changeAni('jump');
    }
    else if (this.isJumping && this.hitBox.vel.y > 0) {
      this.spi.changeAni('fall');
    }

    // Ground collision resets jump
    if (this.hitBox.collides(walls)) {
      this.isJumping = false;
      this.spi.changeAni('idle');
    }

    // Attack
    if (keyIsDown(32)) {
      this.spi.changeAni('attack');
    }

    // Sync sprite to hitBox
    this.spi.position.x = this.hitBox.position.x + (this.spi.mirror.x ? -18 : 18);
    this.spi.position.y = this.hitBox.position.y - 24;

    // Debug toggle: hold mouse to show debug boxes
    if (mouseIsPressed) {
      allSprites.debug = true;
    }
  }

  doAll() {
    this.handleInput();
    this.spi.update();
    this.spi.draw();
  }
}

// ───────────────────────────────────────────────────────
// 3. PRELOAD IMAGES
// ───────────────────────────────────────────────────────
function preload() {
  // backgrounds
  for (let i = 1; i <= bgCount; i++) {
    const p = `blocks/backgroundWalls/bg${i}.png`;
    bgPaths.push(p);
    images[p] = loadImage(p);
  }
  // walls
  for (let i = 1; i <= wallCount; i++) {
    const p = `blocks/walls/wa${i}.png`;
    wallPaths.push(p);
    images[p] = loadImage(p);
  }
  // decorations
  for (let i = 1; i <= decCount; i++) {
    const p = `blocks/decoration/dec${i}.png`;
    decPaths.push(p);
    images[p] = loadImage(p);
  }
}

// ───────────────────────────────────────────────────────
// 4. SETUP
// ───────────────────────────────────────────────────────
function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();

  // Create collider group
  walls = new Group();

  // Instantiate player
  player = new King();
  player.pre();
  player.respawn();  // start centered

  // Hidden file input + Load button
  fileInput = createFileInput(handleFile);
  fileInput.hide();
  createButton('Load Map')
    .position(10, 10)
    .mousePressed(() => fileInput.elt.click());
}

// ───────────────────────────────────────────────────────
// 5. DRAW LOOP
// ───────────────────────────────────────────────────────
function draw() {
  background(220);

  // Center grid
  const gridW   = cols * tileSize;
  const gridH   = rows * tileSize;
  const offsetX = (width  - gridW) / 2;
  const offsetY = (height - gridH) / 2;

  push();
  translate(offsetX, offsetY);
  drawGrid();
  pop();

  // Update & draw player
  player.doAll();
}

// ───────────────────────────────────────────────────────
// 6. DRAW GRID
// ───────────────────────────────────────────────────────
function drawGrid() {
  noStroke();
  fill(255);
  rect(0, 0, cols*tileSize, rows*tileSize);

  // base
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const src = layers.base[y][x];
      if (src && images[src]) {
        image(images[src], x*tileSize, y*tileSize, tileSize, tileSize);
      }
    }
  }
  // decoration
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const src = layers.decoration[y][x];
      if (src && images[src]) {
        image(images[src], x*tileSize, y*tileSize, tileSize, tileSize);
      }
    }
  }
  // grid lines
  stroke(180);
  noFill();
  for (let i = 0; i <= cols; i++) {
    line(i*tileSize, 0, i*tileSize, rows*tileSize);
  }
  for (let i = 0; i <= rows; i++) {
    line(0, i*tileSize, cols*tileSize, i*tileSize);
  }
}

// ───────────────────────────────────────────────────────
// 7. BUILD WALL COLLIDERS
// ───────────────────────────────────────────────────────
function buildWallColliders() {
  // Destroy any existing colliders
  walls.forEach(s => s.remove());
  // (Optionally) you could also reassign walls = new Group();

  const gridW   = cols * tileSize;
  const gridH   = rows * tileSize;
  const offsetX = (width  - gridW) / 2;
  const offsetY = (height - gridH) / 2;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const src = layers.base[y][x];
      if (src && wallPaths.includes(src)) {
        let s = new Sprite(
          offsetX + x*tileSize + tileSize/2,
          offsetY + y*tileSize + tileSize/2,
          tileSize, tileSize
        );
        s.collider = 'static';
        s.debug    = true;
        s.color    = color(255, 0, 0, 100);
        walls.add(s);
      }
    }
  }
}


// ───────────────────────────────────────────────────────
// 8. HANDLE FILE LOAD
// ───────────────────────────────────────────────────────
function handleFile(file) {
  if (!file || !file.data) {
    return;
  }

  if (!file.name.toLowerCase().endsWith('.json')) {
    alert('Please select a .json file');
    return;
  }

  try {
    const data = typeof file.data === 'string'
      ? JSON.parse(file.data)
      : file.data;

    if (!Array.isArray(data.base) || data.base.length !== rows
      || !data.base.every(r => Array.isArray(r) && r.length === cols)
    ) {
      throw new Error('Missing or malformed base layer');
    }
    layers.base = data.base;

    if (
      Array.isArray(data.decoration) &&
      data.decoration.length === rows &&
      data.decoration.every(r => Array.isArray(r) && r.length === cols)
    ) {
      layers.decoration = data.decoration;
    }
    else {
      layers.decoration = Array.from(
        { length: rows },
        () => Array(cols).fill(null)
      );
    }

    buildWallColliders();
    player.respawn();
    console.log('Map loaded successfully!');
  }
  catch (err) {
    alert('Invalid map file: ' + err.message);
  }
}

// ───────────────────────────────────────────────────────
// 9. WINDOW RESIZE
// ───────────────────────────────────────────────────────
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
