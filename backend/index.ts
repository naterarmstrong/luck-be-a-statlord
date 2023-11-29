import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from "uuid";
import * as OpenApiValidator from 'express-openapi-validator';
import { SessionController } from './controllers/sessionController';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { checkLogin } from './middleware/userAuth'
import { User } from './models/user';
import { sequelize } from './db/db';

const secrets = dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const sessionController = new SessionController();

const corsOptions = {
    // For now, this allows any request origin to send things in via browser. Once deployed, maybe
    // this should change or be set by an env variable.
    origin: true,
    // We need to allow credentials to allow sending the JWT token used for authentication
    credentials: true,
};
app.use(cors(corsOptions))


app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('combined'))

app.use('/spec', express.static('./api.yaml'));

app.use(checkLogin);

sequelize.sync({ force: true }).then(() => console.log("DB has been synced."));

// app.use(
//     OpenApiValidator.middleware({
//         apiSpec: './api.yaml',
//         validateRequests: true,
//         // This should probably be false in production
//         validateResponses: true,
//     })
// );

const DAY = 1 * 24 * 60 * 60 * 1000;

app.post('/register', async (req, res) => {
    const userInDB = await User.findOne({ where: { username: req.body.username } });
    if (userInDB != null) {
        return res.status(409).send("User already exists");
    }

    const { username, password } = req.body;
    const safePass = await bcrypt.hash(password, 10);
    const data = {
        username,
        password: safePass
    }
    const user = await User.create(data);

    if (user) {
        let token = jwt.sign({ username: username }, "asdf", { expiresIn: DAY });

        res.cookie("jwt", token, { maxAge: DAY, httpOnly: true });
        console.log(`User registered: ${username}, ${token}`);
        return res.status(201).send();
    }
});

app.post('/login', async (req, res) => {
    const userInDB = await User.findOne({ where: { username: req.body.username } });

    const { username, password } = req.body;


    if (userInDB === null) {
        return res.status(401).send("Authentication failed");
    } else {
        const isSame = await bcrypt.compare(password, (userInDB as any).password)
        if (!isSame) {
            return res.status(401).send("Authentication failed");
        }

        let token = jwt.sign({ username: username }, "asdf", { expiresIn: DAY });

        res.cookie("jwt", token, { maxAge: DAY, httpOnly: true });
        console.log(`User signed in: ${username}, ${token}`);
        return res.status(200).send();
    }
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

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.log("LOGGING ERROR")
//     console.error(err);
//     res.status(res.status || 500).json({
//         message: err.message,
//         errors: err.errors,
//     });
// });


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});