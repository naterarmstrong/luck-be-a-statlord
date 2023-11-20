"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionDatabase = void 0;
class SessionDatabase {
    constructor() {
        this.mockDB = new Map();
        this.mockLiveDB = new Map();
    }
    createSession(session) {
        this.mockDB.set(session.id, session);
    }
    getSession(sessionId) {
        return this.mockDB.get(sessionId);
    }
    // TODO: How to make this fail properly? Currently fails silently if session doesn't exist
    createLiveSession(sessionId, liveSessionData) {
        if (!!this.getSession(sessionId)) {
            this.mockLiveDB.set(sessionId, liveSessionData);
        }
    }
    getLiveSession(sessionId) {
        return this.mockLiveDB.get(sessionId);
    }
    updateLiveSession(sessionId, newData) {
        const oldSession = this.mockDB.get(sessionId);
        if (!oldSession) {
            console.log("ERROR: Failed to find old session for live session to be updated.");
            return;
        }
        if (oldSession.videoUrl !== newData.videoUrl) {
            this.mockDB.set(sessionId, Object.assign(Object.assign({}, oldSession), { videoUrl: newData.videoUrl }));
        }
        this.mockLiveDB.set(sessionId, newData);
    }
}
exports.SessionDatabase = SessionDatabase;
