import { initPlayer } from './player/youtubePlayer.js';
import { initControls } from './ui/controls.js';
import { initNowPlaying } from './ui/nowPlaying.js';
import { initBackgroundAmbience } from './ui/background.js';

async function bootstrap() {
  initNowPlaying();
  initControls();
  initBackgroundAmbience();
  await initPlayer();
}

document.addEventListener('DOMContentLoaded', bootstrap);
