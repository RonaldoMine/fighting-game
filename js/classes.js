// Create a class that represent a asset
class Asset {
  constructor({ position, src }) {
    this.position = position; //Initialize a position
    this.height = 150; //Initialize a height
    this.width = 50; //Initialize a width
    this.image = new Image(); // Create empty image element
    this.image.src = src; // Set the source of image
  }

  //What image look like (draw an asset)
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }

  //Update asset
  update() {
    this.draw();
  }
}

// Create a class that represent a player or primarily a rectangle
class Player {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position; //Initialize a position of player
    this.velocity = velocity; //Initialize a velocity of player(how player move)
    this.height = 150; //Initialize a height of a player
    this.width = 50; //Initialize a width of a player
    this.lastKeyPressed; // to store a last key pressed by a user
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: offset,
      with: 100,
      height: 50,
    }; // Attact area
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
  }

  //What player look like (draw a player)
  draw() {
    //Player
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //Attack
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.with,
        this.attackBox.height
      );
    }
  }

  //Update player
  update() {
    this.draw(); //Draw the player
    this.attackBox.position.x = this.position.x - this.attackBox.offset.x; // Increase a x position of player with the horizontal velocity
    this.attackBox.position.y = this.position.y; // Increase a x position of player with the horizontal velocity

    this.position.x += this.velocity.x; // Increase a x position of player with the horizontal velocity
    this.position.y += this.velocity.y; // Increase a y position of player with the vertical velocity
    //check if the player touch a bottom of canvas
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0; //Reset the velocity to zero to stop movement of player
    } else {
      //Add a gravity effect to v elocity of a player
      this.velocity.y += GRAVITY_VALUE;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => (this.isAttacking = false), 100);
  }
}
