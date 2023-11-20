"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveSessionData = void 0;
// Used for storage in database
class LiveSessionData {
    constructor(isPlaying, videoSeconds, videoUrl, timestampSeconds) {
        this.isPlaying = isPlaying;
        this.videoSeconds = videoSeconds;
        this.videoUrl = videoUrl;
        this.timestampSeconds = timestampSeconds;
    }
    toState() {
        return { isPlaying: this.isPlaying, videoSeconds: this.videoSeconds, videoUrl: this.videoUrl };
    }
}
exports.LiveSessionData = LiveSessionData;
