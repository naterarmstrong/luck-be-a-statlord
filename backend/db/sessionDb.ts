import schema from '../models/apiSchema'
import { LiveSessionData } from '../models/liveSessionData';

export type Session = schema.components['schemas']['Session'];

export class SessionDatabase {
    private mockDB: Map<string, Session>;
    private mockLiveDB: Map<string, LiveSessionData>;

    constructor() {
        this.mockDB = new Map<string, Session>();
        this.mockLiveDB = new Map<string, LiveSessionData>();
    }

    createSession(session: Session) {
        this.mockDB.set(session.id, session);
    }

    getSession(sessionId: string): Session | undefined {
        return this.mockDB.get(sessionId);
    }

    // TODO: How to make this fail properly? Currently fails silently if session doesn't exist
    createLiveSession(sessionId: string, liveSessionData: LiveSessionData) {
        if (!!this.getSession(sessionId)) {
            this.mockLiveDB.set(sessionId, liveSessionData);
        }
    }

    getLiveSession(sessionId: string): LiveSessionData | undefined {
        return this.mockLiveDB.get(sessionId);
    }

    updateLiveSession(sessionId: string, newData: LiveSessionData) {
        const oldSession = this.mockDB.get(sessionId);
        if (!oldSession) {
            console.log("ERROR: Failed to find old session for live session to be updated.");
            return;
        }
        if (oldSession.videoUrl !== newData.videoUrl) {
            this.mockDB.set(sessionId, { ...oldSession, videoUrl: newData.videoUrl });
        }
        this.mockLiveDB.set(sessionId, newData);
    }
}