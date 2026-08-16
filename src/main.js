import { initPlayer } from './player/youtubePlayer.js';
import { initControls } from './ui/controls.js';
import { initNowPlaying } from './ui/nowPlaying.js';
import { initBackgroundAmbience } from './ui/background.js';
import { initShuffleHint } from './ui/onboarding.js';
import { initListenerCount } from './ui/listenerCount.js';

async function bootstrap() {
  initNowPlaying();
  initControls();
  initBackgroundAmbience();
  initShuffleHint();
  initListenerCount();
  await initPlayer();
}

document.addEventListener('DOMContentLoaded', bootstrap);
