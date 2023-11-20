

// Used for storage in database
export class LiveSessionData {
    isPlaying: boolean;
    videoSeconds: number;
    videoUrl: string;
    timestampSeconds: number;

    constructor(isPlaying: boolean, videoSeconds: number, videoUrl: string, timestampSeconds: number) {
        this.isPlaying = isPlaying;
        this.videoSeconds = videoSeconds;
        this.videoUrl = videoUrl;
        this.timestampSeconds = timestampSeconds;
    }

    toState(): LiveSessionState {
        return { isPlaying: this.isPlaying, videoSeconds: this.videoSeconds, videoUrl: this.videoUrl }
    }
}

// Use for communication with the client
export type LiveSessionState = {
    isPlaying: boolean,
    videoSeconds: number,
    videoUrl: string,
}