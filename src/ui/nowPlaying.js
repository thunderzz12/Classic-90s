import { subscribe } from '../player/playerState.js';
import { thumbnailUrl, THUMBNAIL_QUALITIES } from '../config.js';
import { formatTime } from '../utils/format.js';

const artEl = document.getElementById('playerArt');
const titleEl = document.getElementById('playerTitle');
const artistEl = document.getElementById('playerArtist');
const progressFillEl = document.getElementById('playerProgressFill');
const elapsedEl = document.getElementById('playerElapsed');
const durationEl = document.getElementById('playerDuration');
const playBtn = document.getElementById('btnPlay');

let lastVideoId = null;


function setArtWithFallback(videoId) {
  let qualityIndex = 0;
  const tryNext = () => {
    if (qualityIndex >= THUMBNAIL_QUALITIES.length) return;
    artEl.src = thumbnailUrl(videoId, THUMBNAIL_QUALITIES[qualityIndex]);
    qualityIndex += 1;
  };
  artEl.onerror = tryNext;
  tryNext();
}

export function initNowPlaying() {
  subscribe((state) => {
    if (state.videoId && state.videoId !== lastVideoId) {
      lastVideoId = state.videoId;
      setArtWithFallback(state.videoId);
    }

    titleEl.textContent = state.title || 'Loading…';
    artistEl.textContent = state.author || '';

    const fraction = state.duration ? state.currentTime / state.duration : 0;
    progressFillEl.style.width = `${Math.min(100, fraction * 100)}%`;

    elapsedEl.textContent = formatTime(state.currentTime);
    durationEl.textContent = formatTime(state.duration);

    playBtn.querySelector('.icon-play').style.display = state.isPlaying ? 'none' : '';
    playBtn.querySelector('.icon-pause').style.display = state.isPlaying ? '' : 'none';
  });
}
