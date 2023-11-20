"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const sessionDb_1 = require("../db/sessionDb");
const liveSessionData_1 = require("../models/liveSessionData");
class SessionController {
    constructor() {
        // todo: create real db
        this.db = new sessionDb_1.SessionDatabase();
    }
    createSession(session) {
        this.db.createSession(session);
    }
    getSession(id) {
        return this.db.getSession(id);
    }
    createLiveSession(sessionId) {
        const oldSession = this.db.getSession(sessionId);
        if (!oldSession) {
            // TODO: bubble up error
            return;
        }
        const liveSessionData = new liveSessionData_1.LiveSessionData(false, 0, oldSession.videoUrl, Date.now() / 1000);
        return this.db.createLiveSession(sessionId, liveSessionData);
    }
    // We extrapolate the current video time out from the last playing event received
    getLiveSession(sessionId) {
        const liveSessionData = this.db.getLiveSession(sessionId);
        if (!liveSessionData || !liveSessionData.isPlaying) {
            return liveSessionData === null || liveSessionData === void 0 ? void 0 : liveSessionData.toState();
        }
        const timePassed = (Date.now() / 1000) - liveSessionData.timestampSeconds;
        const newState = {
            isPlaying: true,
            videoSeconds: timePassed + liveSessionData.videoSeconds,
            videoUrl: liveSessionData.videoUrl
        };
        return newState;
    }
    updateLiveSessionWithURL(sessionId, state) {
        const data = new liveSessionData_1.LiveSessionData(state.isPlaying, state.videoSeconds, state.videoUrl, Date.now() / 1000);
        return this.db.updateLiveSession(sessionId, data);
    }
    // Update a live session, but do not update the URL
    updateLiveSession(sessionId, state) {
        const oldData = this.db.getLiveSession(sessionId);
        if (!oldData) {
            console.log("ERROR: Failed to find live session data");
            return;
        }
        else if (oldData.videoUrl != state.videoUrl) {
            console.log("Ignoring update due to outdated video URL");
            return;
        }
        const data = new liveSessionData_1.LiveSessionData(state.isPlaying, state.videoSeconds, oldData.videoUrl, Date.now() / 1000);
        return this.db.updateLiveSession(sessionId, data);
    }
}
exports.SessionController = SessionController;
