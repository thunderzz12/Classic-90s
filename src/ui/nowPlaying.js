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


const PLACEHOLDER_SIZE_THRESHOLD_BYTES = 2000;
 
async function findBestThumbnailUrl(videoId) {
  for (const quality of THUMBNAIL_QUALITIES) {
    const url = thumbnailUrl(videoId, quality);
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const size = Number(response.headers.get('content-length') || 0);
      if (response.ok && size > PLACEHOLDER_SIZE_THRESHOLD_BYTES) {
        return url;
      }
    } catch {
    }
  }
  
  return thumbnailUrl(videoId, 'hqdefault');
}
 
async function setArtWithFallback(videoId) {
  const url = await findBestThumbnailUrl(videoId);
  if (lastVideoId !== videoId) return; 
  artEl.src = url;
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