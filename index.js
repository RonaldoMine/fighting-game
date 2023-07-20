const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024; // Defined a width to a canvas
canvas.height = 576; // Defined a heigth to a canvas
//thoses values is used to ensure that the canvas fit for most screen sizes

c.fillRect(0, 0, canvas.width, canvas.height); // Create a area fo drawing in canvas

const background = new Asset({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Asset({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

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
    x: 215,
    y: 157,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Player({
  position: {
    x: 500,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: 215,
    y: 170,
  },
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -172,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

//Infinity loop function
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black"; // Set a background in black before
  c.fillRect(0, 0, canvas.width, canvas.height); // Create a empty rect with the same width and height of the initial canvas
  c.fillStyle = "rgba(255,255,255, 0.15)";
  background.draw();
  shop.update();
  c.fillRect(0, 0, canvas.width, canvas.height);
  actor.update();
  enemy.update();

  //Actor movement
  //Vertical
  updateActorMovement(actor);
  updateEnemyMovement(enemy);

  //Detect if actor attemp to attack enemy
  if (
    playerCollision({ player1: actor, player2: enemy }) &&
    actor.isAttacking &&
    actor.framesCurrent === 4
  ) {
    actor.isAttacking = false;
    if (!GAME_STATE.game_over) {
      enemy.takeHit();
      gsap.to("#enemyHealth", {
        width: `${enemy.health}%`,
      });
    }
  }

  //Check if actor lose there attack
  if (actor.isAttacking && actor.framesCurrent === 4) {
    actor.isAttacking = false;
  }

  //Detect if actor attemp to attack enemy
  if (
    playerCollision({ player1: enemy, player2: actor }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    enemy.isAttacking = false;
    if (!GAME_STATE.game_over) {
      actor.takeHit();
      gsap.to("#actorHealth", {
        width: `${actor.health}%`,
      });
    }
  }

  //Check if player lose there attack
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
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
    switch (e.key.toLowerCase()) {
      //Actor Keys
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
