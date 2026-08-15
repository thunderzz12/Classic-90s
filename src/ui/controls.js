import {
  togglePlay,
  nextTrack,
  prevTrack,
  seekToFraction,
  toggleShuffle,
  toggleRepeat,
} from '../player/youtubePlayer.js';
import { subscribe } from '../player/playerState.js';


const playBtn = document.getElementById('btnPlay');
const nextBtn = document.getElementById('btnNext');
const prevBtn = document.getElementById('btnPrev');
const shuffleBtn = document.getElementById('btnShuffle');
const repeatBtn = document.getElementById('btnRepeat');
const shuffleTooltipText = document.getElementById('shuffleTooltipText');
const repeatTooltipText = document.getElementById('repeatTooltipText');
const repeatIconSlot = document.getElementById('repeatIconSlot');
const progressBar = document.getElementById('playerProgress');

const REPEAT_ICON = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75z"/></svg>';
const REPEAT_ONE_ICON = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h.75v1.5h-.75A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75zM12.25 2.5a2.25 2.25 0 0 1 2.25 2.25v5A2.25 2.25 0 0 1 12.25 12H9.81l1.018-1.018a.75.75 0 0 0-1.06-1.06L6.939 12.75l2.829 2.828a.75.75 0 1 0 1.06-1.06L9.811 13.5h2.439A3.75 3.75 0 0 0 16 9.75v-5A3.75 3.75 0 0 0 12.25 1h-.75v1.5z"/><path d="m8 1.85.77.694H6.095V1.488q1.046-.077 1.507-.385.474-.308.583-.913h1.32V8H8z"/><path d="M8.77 2.544 8 1.85v.693z"/></svg>';
 
const REPEAT_TOOLTIP_TEXT = {
  off: 'Enable repeat playlist',
  all: 'Enable repeat one',
  one: 'Disable repeat',
};

function fractionFromPointer(event) {
  const rect = progressBar.getBoundingClientRect();
  const x = event.clientX - rect.left;
  return Math.min(1, Math.max(0, x / rect.width));
}

export function initControls() {
  playBtn.addEventListener('click', togglePlay);
  nextBtn.addEventListener('click', nextTrack);
  prevBtn.addEventListener('click', prevTrack);
  shuffleBtn.addEventListener('click', toggleShuffle);
  repeatBtn.addEventListener('click', toggleRepeat);


  // toggle state for shuffle repeat btn
  subscribe((state) => {
    shuffleBtn.classList.toggle('is-active', state.isShuffled);
    shuffleTooltipText.textContent = state.isShuffled ? 'Disable shuffle' : 'Enable shuffle';
 
    const repeatActive = state.repeatMode !== 'off';
    repeatBtn.classList.toggle('is-active', repeatActive);
    repeatTooltipText.textContent = REPEAT_TOOLTIP_TEXT[state.repeatMode];
    repeatIconSlot.innerHTML = state.repeatMode === 'one' ? REPEAT_ONE_ICON : REPEAT_ICON;
  });

  let isDragging = false;

  progressBar.addEventListener('pointerdown', (event) => {
    isDragging = true;
    progressBar.setPointerCapture(event.pointerId);
    seekToFraction(fractionFromPointer(event));
  });
 
  progressBar.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    seekToFraction(fractionFromPointer(event));
  });
 
  progressBar.addEventListener('pointerup', () => {
    isDragging = false;
  });


// space to play/pause, arrows to change track  
  window.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT') return;
    if (event.code === 'Space') {
      event.preventDefault();
      togglePlay();
    } else if (event.code === 'ArrowRight') {
      nextTrack();
    } else if (event.code === 'ArrowLeft') {
      prevTrack();
    }
  });
}
