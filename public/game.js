export default function createGame () {
  const state = {
  players: { },
  fruits: { },
  screen: {
    width: 10,
    height: 10
  }
  };

  function addPlayer (command) {
    const { playerId, x, y } = command;
    state.players[playerId] = { playerId, x, y, score: 0 };
  }

  function removePlayer (command) {
    const { playerId } = command;
    delete state.players[playerId];
  }

  function movePlayer(command) {
    const tableMap = {
      ArrowUp (player) {
        player.y - 1 < 0
          ? player.y = 0
          : player.y -= 1
      },
      ArrowDown (player) {
        player.y + 1 > state.screen.height - 1
          ? player.y = state.screen.height - 1
          : player.y += 1
      },
      ArrowLeft (player) {
        player.x - 1 < 0
          ? player.x = 0
          : player.x -= 1
      },
      ArrowRight (player) {
        player.x + 1 > state.screen.width - 1
          ? player.x = state.screen.width - 1
          : player.x += 1
      }
    }

    const { keyPressed, playerId } = command;
    const player = state.players[playerId];
    const moveFunction = tableMap[keyPressed];
    if(player && moveFunction ) {
      moveFunction(player);
      checkCollision(player);
    }
  }

  function addFruit (command) {
    const { x, y } = command;
    state.fruits[x + ',' + y] = { x, y, id: x + ',' + y };
  }

  function removeFruit (command) {
    const { fruitId } = command;
    delete state.fruits[fruitId];
  }

  function checkCollision (player) {
    const fruit = state.fruits[player.x + ',' + player.y];
    if(fruit) {
      removeFruit({ fruitId: fruit.id });
      addScore(player);
    }
  }

  function addScore (player) {
    const { playerId } = player;
    const currentPlayer = state.players[playerId];
    currentPlayer.score += 1;
    console.log(`Player ${playerId} score: ${currentPlayer.score}`);
  }

  return {
    addPlayer,
    removePlayer,
    movePlayer,
    addFruit,
    removeFruit,
    state
  }
}
