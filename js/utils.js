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

// Verify collision of 2 players
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