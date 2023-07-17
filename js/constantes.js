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
  timer: 60,
  game_over: false,
}; // Game life cycle
