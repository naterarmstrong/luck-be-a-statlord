"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const OpenApiValidator = __importStar(require("express-openapi-validator"));
const sessionController_1 = require("./controllers/sessionController");
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const io = new socket_io_1.Server(3002, {
    cors: {
        origin: "*"
    }
});
const sessionController = new sessionController_1.SessionController();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('combined'));
app.use('/spec', express_1.default.static('./api.yaml'));
app.use(OpenApiValidator.middleware({
    apiSpec: './api.yaml',
    validateRequests: true,
    // This should probably be false in production
    validateResponses: true,
}));
io.on("connection", socket => {
    console.log(`Client connected to ${socket.id}`);
    console.log(`${io.engine.clientsCount} total connections.`);
    let sessId = "";
    socket.on("joinSession", ({ sessionId }) => {
        var _a;
        console.log(`New user joined session ${sessionId}.`);
        sessId = sessionId;
        socket.join(sessionId);
        const sessionState = sessionController.getLiveSession(sessionId);
        if (sessionState) {
            io.to(sessionId).emit("state", sessionState);
        }
        else {
            // We don't emit state if they are creating the room initially
            sessionController.createLiveSession(sessionId);
        }
        io.to(sessionId).emit("members", (_a = io.sockets.adapter.rooms.get(sessionId)) === null || _a === void 0 ? void 0 : _a.size);
    });
    socket.on("play", ({ sessionId, timestamp, videoUrl }) => {
        console.log(`Receiving play event for session ${sessionId} at ${timestamp}.`);
        const newState = { isPlaying: true, videoSeconds: timestamp, videoUrl: videoUrl };
        sessionController.updateLiveSession(sessionId, newState);
        io.to(sessionId).emit("state", newState);
    });
    socket.on("pause", ({ sessionId, timestamp, videoUrl }) => {
        console.log(`Receiving pause event for session ${sessionId} at ${timestamp}.`);
        const newState = { isPlaying: false, videoSeconds: timestamp, videoUrl: videoUrl };
        sessionController.updateLiveSession(sessionId, newState);
        io.to(sessionId).emit("state", newState);
    });
    socket.on("changeVideo", ({ sessionId, videoUrl }) => {
        console.log(`Receiving change video event for session ${sessionId} to ${videoUrl}.`);
        const newState = { isPlaying: true, videoSeconds: 0, videoUrl: videoUrl };
        sessionController.updateLiveSessionWithURL(sessionId, newState);
        io.to(sessionId).emit("state", newState);
    });
    socket.on("requestState", ({ sessionId }) => {
        console.log(`Sending state upon request to ${socket.id}`);
        const sessionState = sessionController.getLiveSession(sessionId);
        sessionState && io.to(sessionId).emit("state", sessionState);
    });
    socket.on("disconnect", (reason) => {
        var _a;
        console.log(`Client disconnected for reason ${reason}`);
        io.to(sessId).emit("members", (_a = io.sockets.adapter.rooms.get(sessId)) === null || _a === void 0 ? void 0 : _a.size);
    });
});
app.post('/session', (req, res) => {
    // Server should generate IDs
    const sessionId = (0, uuid_1.v4)();
    const session = Object.assign({ id: sessionId }, req.body);
    sessionController.createSession(session);
    sessionController.createLiveSession(session);
    console.log("Creating session:\n", session);
    res.status(201).json(session);
});
app.get('/sessions/:id', (req, res) => {
    const id = req.params.id;
    const sessionData = sessionController.getSession(id);
    if (!!sessionData) {
        console.log("Sending session data:\n", sessionData);
        res.status(200).send(sessionData);
    }
    else {
        console.log("Failed to find session data:\n", id);
        res.status(404).send();
    }
});
app.use((err, req, res) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
