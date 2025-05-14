// class/mapGenerator.js
class MapGenerator {
  constructor({ cols, rows, tileSize, bgCount, wallCount, decCount }) {
    this.COLS      = cols;
    this.ROWS      = rows;
    this.TILE_SIZE = tileSize;

    // two grids: base (bg+walls) and decoration
    this.layers = {
      base:        Array.from({ length: rows }, () => Array(cols).fill(null)),
      decoration:  Array.from({ length: rows }, () => Array(cols).fill(null)),
    };

    this.images  = {};
    this.current = null;
    this.mode    = 'base'; // 'base' or 'decoration'

    // build two asset lists
    this.BACKGROUNDS  = Array.from({ length: bgCount }, (_, i) =>
      `blocks/background_walls/bg${i+1}.png`
    );
    this.WALLS        = Array.from({ length: wallCount }, (_, i) =>
      `blocks/walls/wa${i+1}.png`
    );
    this.DECORATIONS  = Array.from({ length: decCount }, (_, i) =>
      `blocks/decoration/dec${i+1}.png`
    );
  }

  preload() {
    // preload all images
    [...this.BACKGROUNDS, ...this.WALLS, ...this.DECORATIONS].forEach(src => {
      this.images[src] = loadImage(src);
    });
  }

  setup() {
    // create and shift canvas
    const cnv = createCanvas(
      this.COLS * this.TILE_SIZE,
      this.ROWS * this.TILE_SIZE
    );
    noSmooth();
    const sidebarW = 3*(this.TILE_SIZE+14) + 16;
    cnv.position(sidebarW, 0);

    // build left (base) and right (decoration) wheels
    this._buildBaseSelector();
    this._buildDecSelector(sidebarW + this.COLS * this.TILE_SIZE + 16);

    // controls (save/load)
    this._buildControls(sidebarW);

    // default pick first background
    this.current = this.BACKGROUNDS[0];
    this.mode    = 'base';
    this._highlightBase(0);
  }

  draw() {
    background(200);
    // draw base layer
    this._drawLayer('base');
    // draw decoration layer on top
    this._drawLayer('decoration');
    // grid lines
    stroke(180); noFill();
    for (let x = 0; x <= this.COLS; x++) {
      line(x*this.TILE_SIZE, 0, x*this.TILE_SIZE, height);
    }
    for (let y = 0; y <= this.ROWS; y++) {
      line(0, y*this.TILE_SIZE, width, y*this.TILE_SIZE);
    }
  }

  mousePressed() {
    if (mouseX < width && mouseY < height && this.current) {
      const gx = floor(mouseX / this.TILE_SIZE);
      const gy = floor(mouseY / this.TILE_SIZE);
      this.layers[this.mode][gy][gx] = this.current;
      this._checkComplete();
    }
  }

  // ────────────────────────────────────────────────────
  // PRIVATE
  // ────────────────────────────────────────────────────

  _drawLayer(name) {
    for (let y = 0; y < this.ROWS; y++) {
      for (let x = 0; x < this.COLS; x++) {
        const src = this.layers[name][y][x];
        if (src) {
          image(
            this.images[src],
            x*this.TILE_SIZE, y*this.TILE_SIZE,
            this.TILE_SIZE,  this.TILE_SIZE
          );
        }
      }
    }
  }

  _buildBaseSelector() {
    const w = 3*(this.TILE_SIZE+4) + 16;
    this.baseSel = createDiv().id('selector-base').style(`
      position:fixed; top:0; left:0;
      width:${w}px; height:100vh;
      display:grid; grid-template-columns:repeat(3, ${this.TILE_SIZE}px);
      gap:4px; padding:8px; background:#f0f0f0; overflow-y:auto;
    `);

    // backgrounds then walls
    [...this.BACKGROUNDS, ...this.WALLS].forEach((src,i) => {
      createImg(src,'')
        .parent(this.baseSel)
        .size(this.TILE_SIZE,this.TILE_SIZE)
        .style('cursor:pointer;border:2px solid transparent')
        .mouseClicked(() => {
          this.current = src;
          this.mode    = 'base';
          this._highlightBase(i);
        });
    });
  }

  _buildDecSelector(left) {
    const w = 3*(this.TILE_SIZE+4) + 16;
    this.decSel = createDiv().id('selector-dec').style(`
      position:fixed; top:0; left:${left}px;
      width:${w}px; height:100vh;
      display:grid; grid-template-columns:repeat(3, ${this.TILE_SIZE}px);
      gap:4px; padding:8px; background:#e8f7e8; overflow-y:auto;
    `);

    this.DECORATIONS.forEach((src,i) => {
      createImg(src,'')
        .parent(this.decSel)
        .size(this.TILE_SIZE,this.TILE_SIZE)
        .style('cursor:pointer;border:2px solid transparent')
        .mouseClicked(() => {
          this.current = src;
          this.mode    = 'decoration';
          this._highlightDec(i);
        });
    });
  }

  _buildControls(left) {
    this.controls = createDiv().id('controls').style(`
      position:fixed; left:${left}px; bottom:8px;
      display:flex; gap:8px;
    `);
    this.saveBtn = createButton('Save').parent(this.controls)
      .attribute('disabled','').mouseClicked(() => this._save());
    createButton('Load').parent(this.controls)
      .mouseClicked(() => this._load());
  }

  _highlightBase(idx) {
    this.baseSel.elt.querySelectorAll('img')
      .forEach((img,i) => img.style.borderColor = i===idx?'#0077cc':'transparent');
  }

  _highlightDec(idx) {
    this.decSel.elt.querySelectorAll('img')
      .forEach((img,i) => img.style.borderColor = i===idx?'#0077cc':'transparent');
  }

  _checkComplete() {
    const bgDone   = this.layers.base   .every(r=>r.every(c=>c));
    if (bgDone) {
      this.saveBtn.removeAttribute('disabled');
    }
    else        {
      this.saveBtn.attribute('disabled','');
    }
  }

  _save() {
    const data = JSON.stringify(this.layers);
    localStorage.setItem('savedMap', data);
    const blob = new Blob([data],{type:'application/json'});
    const url  = URL.createObjectURL(blob);
    const a    = createA(url,'map.json').attribute('download','map.json').hide();
    a.elt.click(); URL.revokeObjectURL(url);
  }

  _load() {
    const raw = localStorage.getItem('savedMap');
    if (raw===null) {
      return alert('No saved map found!');
    }
    let data;
    try {
      data = JSON.parse(raw); 
    }
    catch {
      return alert('Invalid saved map!');
    }
    if (!data.base || !data.decoration) {
      return alert('Saved map missing layers!');
    }
    this.layers = data;
    this._checkComplete();
  }
}

window.MapGenerator = MapGenerator;
