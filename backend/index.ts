import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from "uuid";
import cookieParser from 'cookie-parser';
import { AuthorizedRequest, checkLogin } from './middleware/userAuth'
import { User, UserModel } from './models/user';
import { Run, Spin, SpinSymbol } from './models/run';
import { sequelize } from './db/db';

const secrets = dotenv.config();

// Temporary secret for use in testing, later this should come from dotenv
export const JWT_SECRET = "asdf";

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
    // For now, this allows any request origin to send things in via browser. Once deployed, maybe
    // this should change or be set by an env variable.
    origin: true,
    // We need to allow credentials to allow sending the JWT token used for authentication
    credentials: true,
};
app.use(cors(corsOptions))


app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
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
    if (req.username && req.username !== req.body.username) {
        console.log(`Received registration request when user already logged in: username: ${req.username}`);
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
        let token = jwt.sign({ username: username, id: (user as any).id }, JWT_SECRET, { expiresIn: DAY });

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

app.post('/uploadRuns', async (req: AuthorizedRequest, res) => {
    // Make sure they are logged in
    if (!req.userId) {
        return res.status(401).send("Not logged in.");
    }

    console.log(req.body)
    for (const run of req.body) {
        await Run.create({
            UserId: req.userId,
            number: run.number,
            victory: run.victory,
            guillotine: run.guillotine,
            spins: run.spins,
            date: run.date,
            duration: run.duration,
            version: run.version,
            // If using postgres, this can be array
            earlySyms: run.earlySyms.join(','),
            midSyms: run.earlySyms.join(','),
            lateSyms: run.earlySyms.join(','),
        });
        // TODO: Finish uploading runs
    }

    return res.status(201).send();
});

app.get('/user/:id/runs', async (req, res) => {
    // TODO: paginate this based on query params
    if (isNaN(parseInt(req.params.id, 10))) {
        return res.status(400).send("Bad user ID");
    }

    const [runs, _] = await sequelize.query(`SELECT * FROM Runs WHERE Runs.UserId = ${parseInt(req.params.id, 10)}`);
    console.log(runs);

    return res.status(200).send(runs);
});

app.get('/user/:id/stats', async (req, res) => {
    if (isNaN(parseInt(req.params.id, 10))) {
        return res.status(400).send("Bad user ID");
    }

    const [stats, _] = await sequelize.query(`SELECT
        COUNT(*) AS total_games,
        SUM(CASE WHEN victory = true THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN guillotine = true THEN 1 ELSE 0 END) as guillotines,
        SUM(CASE WHEN spins > 5 THEN 1 ELSE 0 END) as beat_rent_1_count,
        SUM(CASE WHEN spins > 10 THEN 1 ELSE 0 END) as beat_rent_2_count,
        SUM(CASE WHEN spins > 16 THEN 1 ELSE 0 END) as beat_rent_3_count,
        SUM(CASE WHEN spins > 22 THEN 1 ELSE 0 END) as beat_rent_4_count,
        SUM(CASE WHEN spins > 29 THEN 1 ELSE 0 END) as beat_rent_5_count,
        SUM(CASE WHEN spins > 36 THEN 1 ELSE 0 END) as beat_rent_6_count,
        SUM(CASE WHEN spins > 44 THEN 1 ELSE 0 END) as beat_rent_7_count,
        SUM(CASE WHEN spins > 52 THEN 1 ELSE 0 END) as beat_rent_8_count,
        SUM(CASE WHEN spins > 61 THEN 1 ELSE 0 END) as beat_rent_9_count,
        SUM(CASE WHEN spins > 70 THEN 1 ELSE 0 END) as beat_rent_10_count,
        SUM(CASE WHEN spins > 80 THEN 1 ELSE 0 END) as beat_rent_11_count,
        SUM(CASE WHEN spins > 90 THEN 1 ELSE 0 END) as beat_rent_12_count,
        SUM(CASE WHEN spins > 100 THEN 1 ELSE 0 END) as beat_rent_13_count
    FROM Runs
    WHERE Runs.UserId = ${parseInt(req.params.id)}`);

    return res.status(200).send(stats);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});