import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { v4 as uuidv4 } from "uuid";
import * as OpenApiValidator from 'express-openapi-validator';
import { SessionController } from './controllers/sessionController';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const io = new Server(3002,
    {
        cors: {
            origin: "*"
        }
    });

const sessionController = new SessionController();

app.use(cors())
app.use(bodyParser.json());
app.use(morgan('combined'))

app.use('/spec', express.static('./api.yaml'));

app.use(
    OpenApiValidator.middleware({
        apiSpec: './api.yaml',
        validateRequests: true,
        // This should probably be false in production
        validateResponses: true,
    })
);

io.on("connection", socket => {
    console.log(`Client connected to ${socket.id}`);
    console.log(`${io.engine.clientsCount} total connections.`);
    let sessId: string = "";
    socket.on("joinSession", ({ sessionId }) => {
        console.log(`New user joined session ${sessionId}.`);
        sessId = sessionId;
        socket.join(sessionId);
        const sessionState = sessionController.getLiveSession(sessionId);
        if (sessionState) {
            io.to(sessionId).emit("state", sessionState);
        } else {
            // We don't emit state if they are creating the room initially
            sessionController.createLiveSession(sessionId);
        }
        io.to(sessionId).emit("members", io.sockets.adapter.rooms.get(sessionId)?.size);
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
    })
    socket.on("requestState", ({ sessionId }) => {
        console.log(`Sending state upon request to ${socket.id}`);
        const sessionState = sessionController.getLiveSession(sessionId);
        sessionState && io.to(sessionId).emit("state", sessionState);
    });
    socket.on("disconnect", (reason: string) => {
        console.log(`Client disconnected for reason ${reason}`)
        io.to(sessId).emit("members", io.sockets.adapter.rooms.get(sessId)?.size);
    })
});

app.post('/session', (req, res) => {
    // Server should generate IDs
    const sessionId = uuidv4();
    const session = { id: sessionId, ...req.body };
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
    } else {
        console.log("Failed to find session data:\n", id);
        res.status(404).send();
    }
});

app.use((err: any, req: Request, res: Response) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});