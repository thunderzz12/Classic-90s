
const state = {
  isReady: false,
  isPlaying: false,
  videoId: null,
  title: '',
  author: '',
  currentTime: 0,
  duration: 0,
  isShuffled: false,
  repeatMode: 'off',
};

const listeners = new Set();

export function getState() {
  return state;
}

export function setState(patch) {
  Object.assign(state, patch);
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
