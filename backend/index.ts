import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { v4 as uuidv4 } from "uuid";
import * as OpenApiValidator from 'express-openapi-validator';
import { SessionController } from './controllers/sessionController';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { checkLogin } from './middleware/userAuth'

const secrets = dotenv.config();

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
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('combined'))

app.use('/spec', express.static('./api.yaml'));

app.use(checkLogin);

console.log("Starting up")

// app.use(
//     OpenApiValidator.middleware({
//         apiSpec: './api.yaml',
//         validateRequests: true,
//         // This should probably be false in production
//         validateResponses: true,
//     })
// );


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