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
  },
  enemy: {
    left: {
      value: "ArrowLeft",
      pressed: false,
    },
    right: {
      value: "ArrowRight",
      pressed: false,
    },
    top: {
      value: "ArrowUp",
      pressed: false,
    },
  },
}; // Alls the keys actions to manage player
const HORIZONTAL_VELOCITY_PLAYER_MOVEMENT_VALUE = 5; // a velocity or speed horizontal movement of a player
const VERTICAL_VELOCITY_PLAYER_MOVEMENT_VALUE = 20; // a velocity or speed vertical movement of a player

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024; // Defined a width to a canvas
canvas.height = 576; // Defined a heigth to a canvas
//thoses values is used to ensure that the canvas fit for most screen sizes

c.fillRect(0, 0, canvas.width, canvas.height); // Create a area fo drawing in canvas

// Create a class that represent a player or primarily a rectangle
class Player {
  constructor({ position, velocity }) {
    this.position = position; //Initialize a position of player
    this.velocity = velocity; //Initialize a velocity of player(how player move)
    this.height = 150; //Initialize a height of a player
    this.lastKeyPressed;
  }

  //What player look like (draw a player)
  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, this.height);
  }

  update() {
    this.draw(); //Draw the player
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

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black"; // Set a background in black before
  c.fillRect(0, 0, canvas.width, canvas.height); // Create a empty rect with the same width and with of the initial canvas
  actor.update();
  enemy.update();

  //Actor movement
  updateActorMovement(actor);
  updateEnemyMovement(enemy);
}

animate();

// Move player
window.addEventListener("keydown", function (e) {
  //Actor Keys
  switch (e.key.toLowerCase()) {
    case GAME_MOVE_KEYS.actor.left.value:
      //actor.velocity.x = -HORIZONTAL_VELOCITY_PLAYER_MOVEMENT_VALUE; //Move left
      actor.lastKeyPressed = GAME_MOVE_KEYS.actor.left.value;
      GAME_MOVE_KEYS.actor.left.pressed = true;
      break;
    case GAME_MOVE_KEYS.actor.right.value:
      //actor.velocity.x = HORIZONTAL_VELOCITY_PLAYER_MOVEMENT_VALUE; // Move right
      actor.lastKeyPressed = GAME_MOVE_KEYS.actor.right.value;
      GAME_MOVE_KEYS.actor.right.pressed = true;
      break;
    case GAME_MOVE_KEYS.actor.top.value:
      actor.velocity.y = -VERTICAL_VELOCITY_PLAYER_MOVEMENT_VALUE; // reduce a velocity and left a gravity make a effect
      break;
  }
  //Enemy Keys
  switch (e.key) {
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
  }
});

//Stop a player's movement
window.addEventListener("keyup", function (e) {
  //Actor Keys
  switch (e.key.toLowerCase()) {
    case GAME_MOVE_KEYS.actor.left.value:
      GAME_MOVE_KEYS.actor.left.pressed = false;
      break;
    case GAME_MOVE_KEYS.actor.right.value:
      GAME_MOVE_KEYS.actor.right.pressed = false;
      break;
  }
  //Enemy Keys
  switch (e.key) {
    case GAME_MOVE_KEYS.enemy.left.value:
      enemy.velocity.x = 0;
      GAME_MOVE_KEYS.enemy.left.pressed = false;
      break;
    case GAME_MOVE_KEYS.enemy.right.value:
      enemy.velocity.x = 0;
      GAME_MOVE_KEYS.enemy.right.pressed = false;
      break;
  }
});
