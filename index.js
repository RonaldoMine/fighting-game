const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024; // Defined a width to a canvas
canvas.height = 576; // Defined a heigth to a canvas
//thoses values is used to ensure that the canvas fit for most screen sizes

c.fillRect(0, 0, canvas.width, canvas.height); // Create a area fo drawing in canvas

const background = new Asset({
  position: {
    x:0,
    y:0 
  },
  src: "./img/background.png"
})

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

//Infinity loop function
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black"; // Set a background in black before
  c.fillRect(0, 0, canvas.width, canvas.height); // Create a empty rect with the same width and with of the initial canvas
  background.draw();
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
  if (!GAME_STATE.game_over) {
    //Actor Keys
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
