// sketch.js
// ---------------------------------------------------------

const COLS      = 20;
const ROWS      = 14;
const TILE_SIZE = 48;

let tiles      = [];
let images     = {};
let currentSrc = null;

// Build background + wall paths
const BACKGROUNDS = Array.from({ length: 47 }, (_, i) =>
  `blocks/background_walls/bg${i + 1}.png`
);
const WALLS = Array.from({ length: 47 }, (_, i) =>
  `blocks/walls/wa${i + 1}.png`
);
const ASSETS = [...BACKGROUNDS, ...WALLS];

function preload() {
  ASSETS.forEach(src => {
    images[src] = loadImage(src);
  });
}

function setup() {
  createCanvas(COLS * TILE_SIZE, ROWS * TILE_SIZE);
  noSmooth();

  for (let y = 0; y < ROWS; y++) {
    tiles[y] = Array(COLS).fill(null);
  }

  buildSelector();

  currentSrc = ASSETS[0];
  markSelected(0);

  select('#save').mousePressed(saveMap);
  select('#load').mousePressed(loadMap);
}

function draw() {
  background(200);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const src = tiles[y][x];
      if (src) {
        image(images[src], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else {
        fill(240);
        stroke(180);
        rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function mousePressed() {
  if (mouseX < width && mouseY < height && currentSrc) {
    const gx = floor(mouseX / TILE_SIZE);
    const gy = floor(mouseY / TILE_SIZE);
    tiles[gy][gx] = currentSrc;
    checkAllFilled();
  }
}

function checkAllFilled() {
  const complete = tiles.every(row => row.every(cell => cell !== null));
  if (complete) {
    select('#save').removeAttribute('disabled');
  } else {
    select('#save').attribute('disabled', '');
  }
}

function buildSelector() {
  const container = select('#selector');
  ASSETS.forEach((src, idx) => {
    const img = createImg(src, '').parent(container).size(TILE_SIZE, TILE_SIZE);
    img.mouseClicked(() => {
      currentSrc = src;
      markSelected(idx);
    });
  });
}

// FIXED markSelected using global selectAll
function markSelected(selectedIdx) {
  // grabs all <img> under #selector
  const thumbs = selectAll('#selector img');
  thumbs.forEach((imgEl, idx) => {
    if (idx === selectedIdx) {
      imgEl.addClass('selected');
    } else {
      imgEl.removeClass('selected');
    }
  });
}

function saveMap() {
  const data = JSON.stringify(tiles);
  localStorage.setItem('savedMap', data);

  const blob = new Blob([data], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = createA(url, 'map.json');
  a.attribute('download', 'map.json');
  a.hide().elt.click();
  URL.revokeObjectURL(url);
}

function loadMap() {
  const raw = localStorage.getItem('savedMap');
  if (!raw) {
    alert('No saved map found!');
    return;
  }
  tiles = JSON.parse(raw);
  checkAllFilled();
}