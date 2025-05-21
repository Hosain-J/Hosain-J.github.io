// class/King.js

class King {
  constructor() {
    this.isJumping = false;
  }

  pre() {
    // Create hitBox and visible sprite
    this.hitBox = new Sprite(0, 0, 45, 53);
    this.spi    = new Sprite(0, 0, 78, 58);

    // Assign spritesheet and animations
    this.spi.spriteSheet = 'assets/king_human_full.png';
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
    this.spi.anis.offset.y = 15;
    this.spi.rotationLock  = true;
    this.spi.collider      = 'NONE';
    this.spi.scale         = 1.7;

    this.hitBox.rotationLock = true;
    this.hitBox.visible      = false;

    allSprites.pixelPerfect = true;
  }

  respawn() {
    // center of the grid
    const gridW   = cols * tileSize;
    const gridH   = rows * tileSize;
    const offsetX = (width  - gridW) / 2;
    const offsetY = (height - gridH) / 2;

    // put hitBox in the exact center
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

    // Optional: hold mouse to show debug boxes
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

window.King = King;