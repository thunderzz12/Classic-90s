import { subscribe } from '../player/playerState.js';

const appEl = document.getElementById('app');


export function setTitleMark(svgMarkup) {
  const slot = document.getElementById('titleMark');
  if (slot && svgMarkup) slot.innerHTML = svgMarkup;
}




export function initBackgroundAmbience() {
  subscribe((state) => {
    appEl.classList.toggle('is-playing', state.isPlaying);
  });
}
