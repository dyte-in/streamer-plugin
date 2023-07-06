import ReactPlayer from "react-player";

const MATCH_URL_YOUTUBE = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//
const MATCH_URL_VIMEO = /vimeo\.com\/(?!progressive_redirect).+/
const MATCH_AUDIO_EXTENSIONS = /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i
const MATCH_VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i
const MATCH_URL_FACEBOOK = /^https?:\/\/(www\.)?facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/;
const MATCH_URL_TWITCH_VIDEO = /(?:www\.|go\.)?twitch\.tv\/videos\/(\d+)($|\?)/;
const MATCH_URL_TWITCH_CHANNEL = /(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)($|\?)/;

const canPlay = (url: string) => {
    if (!url) return false;
    const canPlay = ReactPlayer.canPlay(url);
    if (!canPlay) return false;
    if (MATCH_URL_YOUTUBE.test(url)) return 'youtube';
    if (MATCH_URL_VIMEO.test(url)) return 'vimeo';
    if (MATCH_URL_FACEBOOK.test(url)) return 'facebook';
    if (MATCH_URL_TWITCH_VIDEO.test(url) 
    || MATCH_URL_TWITCH_CHANNEL.test(url)) return 'twitch';
    if (MATCH_AUDIO_EXTENSIONS.test(url)
    || MATCH_VIDEO_EXTENSIONS.test(url)) return 'file';
}

const timeDelta = (currentTime: number, lastUpdated: number) => {
    return currentTime + (
        +new Date() - lastUpdated
    ) / 1000;
}

export {
    canPlay,
    timeDelta,
}