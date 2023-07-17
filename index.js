const GRAVITY_VALUE = 0.7; //Used to increase a horizontal velocity
const GAME_MOVE_KEYS = {
  actor: {
    left: {
      value: "q",
      pressed: false,
    },
    right: {
      value: "d",
      pressed: false,
    },
    top: {
      value: "z",
      pressed: false,
    },
    attact: {
      value: " ",
    },
  },
  enemy: {
    left: {
      value: "arrowleft",
      pressed: false,
    },
    right: {
      value: "arrowright",
      pressed: false,
    },
    top: {
      value: "arrowup",
      pressed: false,
    },
    attact: {
      value: "shift",
    },
  },
}; // Alls the keys actions to manage player
const HORIZONTAL_VELOCITY_PLAYER_MOVEMENT_VALUE = 5; // a velocity or speed horizontal movement of a player
const VERTICAL_VELOCITY_PLAYER_MOVEMENT_VALUE = 20; // a velocity or speed vertical movement of a player

const GAME_STATE = {
  interval: null,
  timer: 10,
  game_over: false,
};

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024; // Defined a width to a canvas
canvas.height = 576; // Defined a heigth to a canvas
//thoses values is used to ensure that the canvas fit for most screen sizes

c.fillRect(0, 0, canvas.width, canvas.height); // Create a area fo drawing in canvas

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
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
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

const actor = new Player({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Player({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: 50,
    y: 0,
  },
});

//Move actor
function updateActorMovement(player) {
  player.velocity.x = 0;
  if (
    GAME_MOVE_KEYS.actor.left.pressed &&
    player.lastKeyPressed === GAME_MOVE_KEYS.actor.left.value
  ) {
    player.velocity.x = -HORIZONTAL_VELOCITY_PLAYER_MOVEMENT_VALUE; // Move left
  } else if (
    GAME_MOVE_KEYS.actor.right.pressed &&
    player.lastKeyPressed === GAME_MOVE_KEYS.actor.right.value
  ) {
    player.velocity.x = HORIZONTAL_VELOCITY_PLAYER_MOVEMENT_VALUE; // Move right
  }
}

//Move enemy
function updateEnemyMovement(player) {
  player.velocity.x = 0;
  if (
    GAME_MOVE_KEYS.enemy.left.pressed &&
    player.lastKeyPressed === GAME_MOVE_KEYS.enemy.left.value
  ) {
    player.velocity.x = -HORIZONTAL_VELOCITY_PLAYER_MOVEMENT_VALUE; // Move left
  } else if (
    GAME_MOVE_KEYS.enemy.right.pressed &&
    player.lastKeyPressed === GAME_MOVE_KEYS.enemy.right.value
  ) {
    player.velocity.x = HORIZONTAL_VELOCITY_PLAYER_MOVEMENT_VALUE; // Move right
  }
}

function rectangularCollision({ reactangular1, rectangular2 }) {
  return (
    reactangular1.position.x + reactangular1.attackBox.with >=
      rectangular2.position.x &&
    rectangular2.position.x + rectangular2.attackBox.with >=
      reactangular1.position.x &&
    reactangular1.attackBox.position.y + reactangular1.attackBox.height >=
      rectangular2.position.y &&
    rectangular2.attackBox.position.y + rectangular2.attackBox.height >=
      reactangular1.position.y
  );
}

function gameTimers() {
  GAME_STATE.interval = setInterval(() => {
    GAME_STATE.timer -= 1;
    document.getElementById("timer").innerText =
      GAME_STATE.timer > 9 ? GAME_STATE.timer : `0${GAME_STATE.timer}`;
    if (GAME_STATE.timer == 0 || GAME_STATE.game_over) {
      stopGame();
    }
  }, 1000);
}

function stopGame() {
  GAME_STATE.game_over = true;
  clearInterval(GAME_STATE.interval);
  document.getElementById("alert").style.display = "block";
  if (actor.health === enemy.health) {
    document.getElementById("alert").innerHTML = "Equality";
  } else {
    document.getElementById("alert").innerHTML = `${
      actor.health > enemy.health ? "Actor wins" : "Enemy wins"
    }`;
  }
}

//Infinity loop function
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black"; // Set a background in black before
  c.fillRect(0, 0, canvas.width, canvas.height); // Create a empty rect with the same width and with of the initial canvas
  actor.update();
  enemy.update();

  //Actor movement
  updateActorMovement(actor);
  updateEnemyMovement(enemy);

  //Detect collision
  if (
    rectangularCollision({ reactangular1: actor, rectangular2: enemy }) &&
    actor.isAttacking
  ) {
    actor.isAttacking = false;
    if (!GAME_STATE.game_over) {
      enemy.health -= 10;
      document.getElementById("enemyHealth").style.width = `${enemy.health}%`;
      if (enemy.health <= 0) {
        stopGame();
        enemy.health = 0;
      }
    }
  }
  if (
    rectangularCollision({ reactangular1: enemy, rectangular2: actor }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    if (!GAME_STATE.game_over) {
      actor.health -= 10;
      document.getElementById("actorHealth").style.width = `${actor.health}%`;
      if (actor.health <= 0) {
        stopGame();
        actor.health = 0;
      }
    }
  }
}

animate();
gameTimers();

// Move player
window.addEventListener("keydown", function (e) {
  if (!GAME_STATE.game_over) {
    switch (e.key.toLowerCase()) {
      //Actor Keys
      case GAME_MOVE_KEYS.actor.left.value:
        actor.lastKeyPressed = GAME_MOVE_KEYS.actor.left.value;
        GAME_MOVE_KEYS.actor.left.pressed = true;
        break;
      case GAME_MOVE_KEYS.actor.right.value:
        actor.lastKeyPressed = GAME_MOVE_KEYS.actor.right.value;
        GAME_MOVE_KEYS.actor.right.pressed = true;
        break;
      case GAME_MOVE_KEYS.actor.top.value:
        actor.velocity.y = -VERTICAL_VELOCITY_PLAYER_MOVEMENT_VALUE; // reduce a velocity and left a gravity make a effect
        break;
      case GAME_MOVE_KEYS.actor.attact.value:
        actor.attack();
        break;
      //Enemy Keys
      case GAME_MOVE_KEYS.enemy.left.value:
        enemy.lastKeyPressed = GAME_MOVE_KEYS.enemy.left.value;
        GAME_MOVE_KEYS.enemy.left.pressed = true;
        break;
      case GAME_MOVE_KEYS.enemy.right.value:
        enemy.lastKeyPressed = GAME_MOVE_KEYS.enemy.right.value;
        GAME_MOVE_KEYS.enemy.right.pressed = true;
        break;
      case GAME_MOVE_KEYS.enemy.top.value:
        enemy.velocity.y = -VERTICAL_VELOCITY_PLAYER_MOVEMENT_VALUE; // reduce a velocity and left a gravity make a effect
        break;
      case GAME_MOVE_KEYS.enemy.attact.value:
        enemy.attack();
        break;
    }
  }
});

//Stop a player's movement
window.addEventListener("keyup", function (e) {
  //Actor Keys
  if (!GAME_STATE.game_over) {
    switch (e.key.toLowerCase()) {
      case GAME_MOVE_KEYS.actor.left.value:
        GAME_MOVE_KEYS.actor.left.pressed = false;
        break;
      case GAME_MOVE_KEYS.actor.right.value:
        GAME_MOVE_KEYS.actor.right.pressed = false;
        break;
      //Enemy Keys
      case GAME_MOVE_KEYS.enemy.left.value:
        enemy.velocity.x = 0;
        GAME_MOVE_KEYS.enemy.left.pressed = false;
        break;
      case GAME_MOVE_KEYS.enemy.right.value:
        enemy.velocity.x = 0;
        GAME_MOVE_KEYS.enemy.right.pressed = false;
        break;
    }
  }
});
