import { PLAYLIST_ID } from "../config.js";
import { setState } from '';

let ytPlayer = null;
let progressTimer = null;

function loadYoutubeApi() {
    return new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
            resolve(window.YT);
            return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);

        window.onYoutubeIframeAPIReady = () => resolve(window.YT);
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

function handleStateChange(event) {
    const YT = window.YT;
    const isPlaying = event.data === YT.PlayerState.PLAYING;

    setState({ isPlaying });




    if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.CUED) {
        const data = ytPlayer.getVideoData();
        setState({
            videoId: data.video_id,
            title: data.title,
            author: data.author,
        });
    }
}


// ASYNC FUNCS~ todo