import { togglePlay, nextTrack, prevTrack, seekToFraction } from '../player/youtubePlayer.js';

const playBtn = document.getElementById('btnPlay');
const nextBtn = document.getElementById('btnNext');
const prevBtn = document.getElementById('btnPrev');
const progressBar = document.getElementById('playerProgress');

function fractionFromPointer(event) {
  const rect = progressBar.getBoundingClientRect();
  const x = event.clientX - rect.left;
  return Math.min(1, Math.max(0, x / rect.width));
}

export function initControls() {
  playBtn.addEventListener('click', togglePlay);
  nextBtn.addEventListener('click', nextTrack);
  prevBtn.addEventListener('click', prevTrack);

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
