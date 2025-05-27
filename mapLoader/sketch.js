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

let images    = {};                  // { filepath: p5.Image }
let bgPaths   = [];                  // list of all background paths
let wallPaths = [];                  // list of all wall paths
let decPaths  = [];                  // list of all decoration paths

let fileInput;                       // hidden <input type="file">
let walls;                           // p5.play Group for wall colliders
let player = new King();       // our King instance

// ───────────────────────────────────────────────────────
// 2. KING CLASS DEFINITION (merged here)
// ───────────────────────────────────────────────────────
// Check class/king.js for full class definition

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
  // load King class
  player.pre();
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

  // add decoration colliders for dec1.png to dec4.png only
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const src = layers.decoration[y][x];
      
      if (src && decPaths.includes(src)) {
        // Extract number from 'blocks/decoration/decX.png'
        const match = src.match(/dec(\d+)\.png$/);
        if (match) {
          const num = parseInt(match[1]);
          if (num >= 1 && num <= 4) {
            let s = new Sprite(
              offsetX + x * tileSize + tileSize / 2,
              offsetY + y * tileSize + tileSize / 4 - 4,
              tileSize,
              tileSize / 3
            );
            s.collider = 'static';
            s.debug = true;
            s.color = color(255, 0, 0, 100);
            walls.add(s);
          }
        }
      }
    }
  }

  // add decoration colliders for dec9.png to dec12.png only
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const src = layers.decoration[y][x];
      
      if (src && decPaths.includes(src)) {
        // Extract number from 'blocks/decoration/decX.png'
        const match = src.match(/dec(\d+)\.png$/);
        if (match) {
          const num = parseInt(match[1]);
          if (num >= 9 && num <= 12) {
            let s = new Sprite(
              offsetX + x * tileSize + tileSize / 2,
              offsetY + y * tileSize + tileSize / 4 - 8,
              tileSize,
              tileSize / 8
            );
            s.collider = 'static';
            s.debug = true;
            s.color = color(255, 0, 0, 100);
            walls.add(s);
          }
        }
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
