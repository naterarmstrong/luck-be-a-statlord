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
import { AuthorizedRequest, checkLogin } from './middleware/userAuth'
import { User, UserModel } from './models/user';
import { sequelize } from './db/db';

const secrets = dotenv.config();

// Temporary secret for use in testing, later this should come from dotenv
export const JWT_SECRET = "asdf";

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

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// User Controls ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
app.post('/register', async (req: AuthorizedRequest, res) => {
    if (req.loggedIn && req.loggedIn !== req.body.username) {
        console.log(`Received registration request when user already logged in: username: ${req.loggedIn}`);
        return res.status(403).send();
    }

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
        let token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: DAY });

        res.cookie("jwt", token, { maxAge: DAY, httpOnly: true });
        console.log(`User registered: ${username}, ${token}`);
        return res.status(201).send({ id: (user as any).id });
    }
});

app.post('/login', async (req: AuthorizedRequest, res) => {
    const userInDB = await User.findOne({ where: { username: req.body.username } });

    const { username, password } = req.body;


    if (userInDB === null) {
        return res.status(401).send("Authentication failed");
    } else {
        const isSame = await bcrypt.compare(password, (userInDB as any).password)
        if (!isSame) {
            return res.status(401).send("Authentication failed");
        }

        let token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: DAY });

        res.cookie("jwt", token, { maxAge: DAY, httpOnly: true });
        console.log(`User signed in: ${username}, ${token}`);
        return res.status(200).send({ id: (userInDB as any).id });
    }
});

app.get('/user/:id', async (req, res) => {
    const user = await User.findOne({ where: { id: req.params.id } }) as UserModel | null;

    if (!user) {
        return res.status(404).send();
    }

    return res.status(200).send({ username: user.username });
})


/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Run Controls ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

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