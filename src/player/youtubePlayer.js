import { PLAYLIST_ID } from "../config.js";
import { setState } from './playerState.js';

let ytPlayer = null;
let progressTimer = null;

// shuffle logic
let originalQueue = [];
let queue = [];
let queueIndex = 0;
let isShuffled = false;
let repeatMode = 'off';
const REPEAT_MODES = ['off', 'all', 'one'];
 
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function loadYouTubeApi() {
    return new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
            resolve(window.YT);
            return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    });
} 



function startProgressLoop() {
 clearInterval(progressTimer);
 progressTimer = setInterval(() => {
    if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
    setState({
        currentTime: ytPlayer.getCurrentTime() || 0,
        duration: ytPlayer.getDuration() || 0,
    });
 }, 500);   
}

const YT_ERROR_MESSAGES = {
  2: 'Invalid video ID / playlist ID',
  5: 'HTML5 player error.',
  100: 'Video not found.',
  101: 'Owner disabled embedding for this video.',
  150: 'Owner disabled embedding for this video.',
};
 
const MAX_CONSECUTIVE_SKIPS = 15;
let consecutiveSkips = 0;
 
function handleError(event) {
  const message = YT_ERROR_MESSAGES[event.data] || `Unknown player error (code ${event.data})`;
  let videoUrl = 'unknown video';
  try {
    const urlFromApi = event.target.getVideoUrl();
    const idFromData = event.target.getVideoData?.()?.video_id;
    videoUrl = idFromData
      ? `https://www.youtube.com/watch?v=${idFromData}`
      : urlFromApi || 'unknown video';
  } catch {
  }
  console.error(`[YT Player] ${message} (skip attempt ${consecutiveSkips + 1}) - ${videoUrl}`);
  setState({ title: `Skipping unplayable track…`, author: '' });
 
  if (![2, 100, 101, 150].includes(event.data)) return;
 
  consecutiveSkips += 1;
  if (consecutiveSkips >= MAX_CONSECUTIVE_SKIPS) {
    console.error(`[YT Player] ${MAX_CONSECUTIVE_SKIPS} tracks in a row failed.`);
    setState({ title: 'Playlist unplayable', author: '' });
    return;
  }
 

  setTimeout(() => goToNext(), 0);
}



function handleStateChange(event) {
    const YT = window.YT;
    const isPlaying = event.data === YT.PlayerState.PLAYING;

    setState({ isPlaying });




    if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.CUED) {
      consecutiveSkips = 0;
      const data = ytPlayer.getVideoData();
      setState({
        videoId: data.video_id,
        title: data.title,
        author: data.author,
      });

      if (originalQueue.length === 0) {
        const playlist = ytPlayer.getPlaylist() || [];
        if (playlist.length > 0) {
          originalQueue = playlist;
          queue = [...playlist];
          queueIndex = ytPlayer.getPlaylistIndex() || 0;
          ytPlayer.cueVideoById(queue[queueIndex]);
        }
      }
  }
 
  if (event.data === YT.PlayerState.ENDED) {
    if (repeatMode === 'one') {
      ytPlayer.seekTo(0, true);
      ytPlayer.playVideo();
      return;
    }
    const atEnd = queueIndex >= queue.length - 1;
    if (atEnd && repeatMode !== 'all') return;
    goToNext();
  }
}


// ASYNC FUNCS~ todo
export async function initPlayer() {
  const YT = await loadYouTubeApi();
 
  return new Promise((resolve) => {
    ytPlayer = new YT.Player('youtube-player', {
      height: '1',
      width: '1',
      playerVars: {
        listType: 'playlist',
        list: PLAYLIST_ID,
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
      },
      events: {
        onReady: () => {
          setState({ isReady: true });
          startProgressLoop();
          ytPlayer.cuePlaylist({ listType: 'playlist', list: PLAYLIST_ID, index: 0 });
          resolve(ytPlayer);
        },
        onStateChange: handleStateChange,
        onError: handleError,
      },
    });
  });
}
 
export function togglePlay() {
  if (!ytPlayer) return;
  const YT = window.YT;
  if (ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
    ytPlayer.pauseVideo();
  } else {
    ytPlayer.playVideo();
  }
}
 
function playQueueIndex() {
  if (!ytPlayer || queue.length === 0) return;
  ytPlayer.loadVideoById(queue[queueIndex]);
}
 
export function goToNext() {
  if (queue.length === 0) return;
  queueIndex = (queueIndex + 1) % queue.length; // wraps to 0 — repeat-all behavior
  playQueueIndex();
}
 
export function goToPrevious() {
  if (queue.length === 0) return;
  queueIndex = (queueIndex - 1 + queue.length) % queue.length;
  playQueueIndex();
}
 
export const nextTrack = goToNext;
export const prevTrack = goToPrevious;

// shuffles the upcoming songs only!
export function toggleShuffle() {
  if (queue.length === 0) return;
  isShuffled = !isShuffled;
  const current = queue[queueIndex];
 
  if (isShuffled) {
    const rest = queue.filter((_, i) => i !== queueIndex);
    queue = [current, ...shuffleArray(rest)];
  } else {
    queue = [...originalQueue];
  }
  queueIndex = queue.indexOf(current);
  setState({ isShuffled });
}
 
export function toggleRepeat() {
  const currentIndex = REPEAT_MODES.indexOf(repeatMode);
  repeatMode = REPEAT_MODES[(currentIndex + 1) % REPEAT_MODES.length];
  setState({ repeatMode });
}


export function seekToFraction(fraction) {
  if (!ytPlayer) return;
  const duration = ytPlayer.getDuration() || 0;
  ytPlayer.seekTo(duration * fraction, true);
}