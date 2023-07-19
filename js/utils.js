//Move actor
function updateActorMovement(player) {
  //Horizontal
  player.velocity.x = 0;
  if (
    GAME_MOVE_KEYS.actor.left.pressed &&
    player.lastKeyPressed === GAME_MOVE_KEYS.actor.left.value
  ) {
    horizontalPlayerMovement(player, DIRECTIONS.left);
  } else if (
    GAME_MOVE_KEYS.actor.right.pressed &&
    player.lastKeyPressed === GAME_MOVE_KEYS.actor.right.value
  ) {
    horizontalPlayerMovement(player, DIRECTIONS.right);
  } else {
    player.switchedSprite(PLAYER_STATE.idle);
  }

  //Vertical
  verticalPlayerMovement(player);
}

//Move enemy
function updateEnemyMovement(player) {
  //Horizontal
  player.velocity.x = 0;
  if (
    GAME_MOVE_KEYS.enemy.left.pressed &&
    player.lastKeyPressed === GAME_MOVE_KEYS.enemy.left.value
  ) {
    horizontalPlayerMovement(player, DIRECTIONS.left);
  } else if (
    GAME_MOVE_KEYS.enemy.right.pressed &&
    player.lastKeyPressed === GAME_MOVE_KEYS.enemy.right.value
  ) {
    horizontalPlayerMovement(player, DIRECTIONS.right);
  } else {
    player.switchedSprite(PLAYER_STATE.idle);
  }
  //Vertical
  verticalPlayerMovement(player);
}
function horizontalPlayerMovement(player, direction) {
  player.switchedSprite(PLAYER_STATE.run);
  if (direction === DIRECTIONS.left) {
    player.velocity.x = -HORIZONTAL_VELOCITY_PLAYER_MOVEMENT_VALUE; // Move left
    if (player.position.x < 0) {
      player.position.x = 0;
    }
  } else {
    player.velocity.x = HORIZONTAL_VELOCITY_PLAYER_MOVEMENT_VALUE; // Move right
    if (player.position.x >= canvas.width - player.width) {
      player.position.x = canvas.width - player.width;
    }
  }
}

function verticalPlayerMovement(player) {
  if (player.velocity.y < 0) {
    player.switchedSprite(PLAYER_STATE.jump);
  } else if (player.velocity.y > 0) {
    player.switchedSprite(PLAYER_STATE.fall);
  }
}

// Verify collision of 2 players
function playerCollision({ player1, player2 }) {
  return (
    player1.attackBox.position.x + player1.attackBox.width >=
      player2.position.x &&
    player2.attackBox.position.x + player2.attackBox.width >=
      player1.position.x &&
    player1.attackBox.position.y + player1.attackBox.height >=
      player2.position.y &&
    player2.attackBox.position.y + player2.attackBox.height >=
      player1.position.y
  );
}

//Manage Game Time
function gameTimers() {
  document.getElementById("timer").innerText = GAME_STATE.timer;
  GAME_STATE.interval = setInterval(() => {
    GAME_STATE.timer -= 1;
    document.getElementById("timer").innerText =
      GAME_STATE.timer > 9 ? GAME_STATE.timer : `0${GAME_STATE.timer}`;
    if (GAME_STATE.timer == 0 || GAME_STATE.game_over) {
      stopGame();
    }
  }, 1000);
}

//Finish Game
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
