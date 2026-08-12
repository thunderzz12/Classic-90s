export const PLAYLIST_ID = 'PLASDflY7MWjE';  // final pl
export const THUMBNAIL_QUALITIES = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault'];
export function thumbnailUrl(videoId, quality = 'hqdefault') {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}