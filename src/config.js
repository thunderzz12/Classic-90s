export const PLAYLIST_ID = 'PLw5TW7oxhu4GJ69HTzacpSLxKhs2Mz9nK';  // test plsylist of x
export const THUMBNAIL_QUALITIES = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault'];
export function thumbnailUrl(videoId, quality = 'hqdefault') {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}