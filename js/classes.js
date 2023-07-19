// Create a class that represent a asset
class Asset {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position; //Initialize a position
    this.height = 150; //Initialize a height
    this.width = 50; //Initialize a width
    this.image = new Image(); // Create empty image element
    this.image.src = imageSrc; // Set the source of image
    this.scale = scale; // Make a zoom to the asset
    this.framesMax = framesMax; // The number of frames content in image
    this.framesCurrent = 0; // Represent the frame view
    this.framesElapsed = 0; // Start of counter
    this.framesHold = 5; // Speed of changing a frames
    this.offset = offset; // Offset outside asset
  }

  //What image look like (draw an asset)
  draw() {
    c.drawImage(
      this.image, // Html Image Element
      (this.image.width / this.framesMax) * this.framesCurrent, //Crop x position in the image
      0, // Crop y position in the image
      this.image.width / this.framesMax, // width crop
      this.image.height, // Height of crop
      this.position.x - this.offset.x, // x position into canvas
      this.position.y - this.offset.y, // y position into canvas
      (this.image.width / this.framesMax) * this.scale, //Width of canvas
      this.image.height * this.scale // Heigth of canvas
    );
  }

  //Change the farame view by user
  animateFrame() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent === this.framesMax - 1) {
        this.framesCurrent = 0;
      } else {
        this.framesCurrent++;
      }
    }
  }
  //Update asset
  update() {
    this.draw();
    this.animateFrame();
  }
}

// Create a class that represent a player or primarily a rectangle
class Player extends Asset {
  constructor({
    position,
    velocity,
    offset,
    imageSrc,
    scale,
    framesMax,
    sprites,
    attackBox = { offset, width: undefined, height: undefined },
  }) {
    super({
      imageSrc,
      position,
      framesMax,
      scale,
      offset,
    });
    //this.position = position; //Initialize a position of player
    this.velocity = velocity; //Initialize a velocity of player(how player move)
    this.height = 150; //Initialize a height of a player
    this.width = 50; //Initialize a width of a player
    this.lastKeyPressed; // to store a last key pressed by a user
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    }; // Attact area
    this.isAttacking = false;
    this.health = 100;
    this.framesCurrent = 0; // Represent the frame view
    this.framesElapsed = 0; // Start of counter
    this.framesHold = 5; // Speed of changing a frames
    this.dead = false;
    this.sprites = sprites;
    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image();
      this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
    }
  }

  //Update player
  update() {
    this.draw(); //Draw the player
    if (!this.dead) {
      this.animateFrame();
    }
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x; // Increase a x position of player width the horizontal velocity
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y; // Increase a x position of player width the horizontal velocity
    this.position.x += this.velocity.x; // Increase a x position of player width the horizontal velocity
    this.position.y += this.velocity.y; // Increase a y position of player width the vertical velocity
    //check if the player touch a bottom of canvas
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0; //Reset the velocity to zero to stop movement of player
      this.position.y = 330; // reset the x position to the exact fall position
    } else {
      //Add a gravity effect to velocity of a player
      this.velocity.y += GRAVITY_VALUE;
    }
  }

  switchedSprite(sprite) {
    // Overiding when player death hits
    if (this.image === this.sprites[PLAYER_STATE.death].image) {
      if (this.framesCurrent === this.framesMax - 1) this.dead = true;
      return;
    }

    // Overiding all other animation with the attack animation
    if (
      this.image === this.sprites[PLAYER_STATE.attact1].image &&
      this.framesCurrent < this.sprites[PLAYER_STATE.attact1].framesMax - 1
    )
      return;

    // Overiding when player gets hits
    if (
      this.image === this.sprites[PLAYER_STATE.takeHit].image &&
      this.framesCurrent < this.sprites[PLAYER_STATE.takeHit].framesMax - 1
    )
      return;

    if (this.image !== this.sprites[sprite].image) {
      this.image = this.sprites[sprite].image;
      this.framesCurrent = 0;
      this.framesMax = this.sprites[sprite].framesMax;
    }
    /* switch (sprite) {
      case PLAYER_STATE.idle:
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesCurrent = 0;
          this.framesMax = this.sprites.idle.framesMax;
        }
        break;
      case PLAYER_STATE.run:
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesCurrent = 0;
          this.framesMax = this.sprites.run.framesMax;
        }
        break;
      case PLAYER_STATE.jump:
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesCurrent = 0;
          this.framesMax = this.sprites.jump.framesMax;
        }
        break;
      case PLAYER_STATE.fall:
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesCurrent = 0;
          this.framesMax = this.sprites.fall.framesMax;
        }
        break;
    } */
  }

  takeHit() {
    this.health -= TAKE_HIT_VALUE;
    if (this.health <= 0) {
      this.switchedSprite(PLAYER_STATE.death);
      this.health = 0;
      stopGame();
    } else {
      this.switchedSprite(PLAYER_STATE.takeHit);
    }
  }

  attack() {
    this.switchedSprite(PLAYER_STATE.attact1);
    this.isAttacking = true;
  }
}
