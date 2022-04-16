export default function createKeyboardListener (document) {
  const state = {
    observers: [],
    playerId: null
  }

  function registerPlayerId (playerId) {
    state.playerId = playerId;
  }

  function subscribe(observer) {
    state.observers.push(observer);
  }

  function unsubscribe(observer) {
    state.observers = state.observers.filter(obs => obs !== observer);
  }

  function notifyAll(command) {
    state.observers.forEach(observer => observer(command));
  }

  document.addEventListener('keydown', handleKeydown);

  function handleKeydown(event) {
    const keyPressed = event.key;
    const command = {
      type: 'movePlayer',
      playerId: state.playerId,
      keyPressed
    }

    notifyAll(command);
  }

  return {
    subscribe,
    unsubscribe,
    registerPlayerId
  }
}
