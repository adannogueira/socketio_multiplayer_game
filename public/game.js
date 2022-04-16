export default function createGame () {
  const state = {
    players: { },
    fruits: { },
    screen: {
      width: 10,
      height: 10
    }
  };

  const observers = [];

  function start () {
    const frequency = 2000;
    setInterval(addFruit, frequency);
  }

  function subscribe (observer) {
    observers.push(observer);
  }

  function notifyAll (command) {
    observers.forEach(observer => observer(command));
  }

  function setState (newState) {
    Object.assign(state, newState);
  }

  function addPlayer (command) {
    const { playerId, x, y } = command;
    state.players[playerId] = {
      playerId,
      x: x ? x : Math.floor(Math.random() * state.screen.width),
      y: y ? y : Math.floor(Math.random() * state.screen.height),
      score: 0
    };

    notifyAll({
      type: 'addPlayer',
      playerId,
      x: state.players[playerId].x,
      y: state.players[playerId].y
    });
  }

  function removePlayer (command) {
    const { playerId } = command;
    delete state.players[playerId];

    notifyAll({
      type: 'removePlayer',
      playerId,
    });
  }

  function movePlayer(command) {
    notifyAll(command);
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
    const x = command?.x ? command.x : Math.floor(Math.random() * state.screen.width);
    const y = command?.y ? command.y : Math.floor(Math.random() * state.screen.height);
    const fruitId = `${x},${y}`;
    if (!state.fruits[fruitId]) {
    state.fruits[fruitId] = { x, y, id: fruitId };
    
    notifyAll({
      type: 'addFruit',
      fruitId,
      x,
      y
    })
    } else {
      addFruit();
    }
  }

  function removeFruit (command) {
    const { fruitId } = command;
    delete state.fruits[fruitId];

    notifyAll({
      type: 'removeFruit',
      fruitId,
    });
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
    setState,
    subscribe,
    state,
    start
  }
}
