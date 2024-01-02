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
import { ItemDetails, ItemDetailsByRent, Run, Spin, SpinSymbol, SymbolDetails, SymbolDetailsByRent } from './models/run';
import { RunInfo, SpinData, SpinInfo } from '../frontend/src/common/models/run'
import { bestUsersQuery, essenceWinratesQuery, itemWinratesQuery, sequelize, symbolPairsQuery, symbolWinratesQuery, symbolsApartQuery, userStatsQuery } from './db/db';
import { replacer, reviver } from '../frontend/src/common/utils/mapStringify';
import { msToTime } from '../frontend/src/common/utils/time';
import { initializeSymbols } from './models/symbol';
import { Op, QueryTypes, UniqueConstraintError, ValidationErrorItem } from 'sequelize';
import { initializeItems } from './models/item';

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
app.use(bodyParser.json({ limit: '50mb', reviver: reviver }));
app.use(morgan('combined'))

app.use('/spec', express.static('./api.yaml'));

app.use(checkLogin);

sequelize.sync().then(async () => {
    console.log("DB has been synced.");
    await initializeSymbols();
    await initializeItems();
    console.log("Symbols have been initialized.");
}
);

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
        return res.status(404).send("User does not exist.");
    } else {
        const isSame = await bcrypt.compare(password, (userInDB as any).password)
        if (!isSame) {
            return res.status(401).send("Wrong password.");
        }

        let token = jwt.sign({ username: username, id: (userInDB as any).id }, JWT_SECRET, { expiresIn: DAY });

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

    let duplicateCount = 0;
    let otherErrorCount = 0;
    let successCount = 0;
    let duplicates: string[] = [];
    let otherErrors: string[] = [];

    const sStart = Date.now()

    // console.log(req.body)
    for (const run of req.body as RunInfo[]) {
        const symbolDetails = [];
        const symbolDetailsByRent = [];
        for (const [symbol, details] of run.details!.symbolDetails.entries()) {
            symbolDetails.push({
                symbol,
                value: details.totalCoins,
                count: details.totalShows,
                earliestRentAdded: details.earliestRentAdded,
                addedByChoice: details.addedByChoice,
                addedByEffect: details.addedByEffect,
                timesRemovedByEffect: details.timesRemovedByEffect,
                timesDestroyedByEffect: details.timesDestroyedByEffect,
                timesRemovedByPlayer: details.timesRemovedByPlayer,
            });
            for (let i = 0; i < 14; i++) {
                if (details.coinsByRentPayment[i] != 0 || details.timesAddedChoiceByRent[i] != 0) {
                    symbolDetailsByRent.push({
                        symbol,
                        rent: i,
                        value: details.coinsByRentPayment[i],
                        timesAdded: details.timesAddedChoiceByRent[i],
                    });
                }
            }
        }

        const itemDetails = [];
        const itemDetailsByRent = [];
        for (const [item, details] of run.details!.itemDetails.entries()) {
            itemDetails.push({
                item,
                earliestRentAdded: details.earliestRentAdded,
                addedByChoice: details.timesAddedByChoice,
                addedByEffect: details.timesAddedNoChoice,
                timesDestroyed: details.timesDestroyed,
            });
            for (let i = 0; i < 14; i++) {
                if (details.timesAddedByRent[i] != 0 || details.timesDestroyedByRent[i] != 0) {
                    itemDetailsByRent.push({
                        item,
                        rent: i,
                        timesDestroyed: details.timesDestroyedByRent[i],
                        timesAdded: details.timesAddedByRent[i],
                    });
                }
            }
        }

        try {

            await Run.create({
                UserId: req.userId,
                hash: run.hash,
                number: run.number,
                victory: run.victory,
                guillotine: run.guillotine,
                isFloor20: run.isFloor20,
                spins: run.spins,
                date: run.date,
                duration: run.duration,
                version: run.version,
                // If using postgres, this can be array
                earlySyms: run.earlySyms.join(','),
                midSyms: run.midSyms.join(','),
                lateSyms: run.lateSyms.join(','),
                SymbolDetails: symbolDetails,
                ItemDetails: itemDetails,
                SymbolDetailsByRent: symbolDetailsByRent,
                ItemDetailsByRent: itemDetailsByRent,
                Spins: run.details!.spins.map((spin: SpinData, idx: number) => {
                    return {
                        coinsEarned: spin.coinsGained,
                        totalCoins: spin.coinTotal,
                        number: idx,
                        FullSpinData: JSON.stringify(spin, replacer),
                    };
                }),
            }, {
                include: [SymbolDetails, Spin, ItemDetails, SymbolDetailsByRent, ItemDetailsByRent],
                benchmark: true,
                logging: false,
            });
            successCount += 1;

            // TODO: Finish uploading runs by uploading the actual symbols of each spin
        } catch (error: any) {
            if (error.errors && error.errors.length == 1 && error.errors[0].type === "unique violation") {
                console.log("Got a duplicate!")
                duplicateCount += 1;
                duplicates.push(run.hash);
            } else {
                otherErrorCount += 1;
                console.log("Got an error: ", error)
                otherErrors.push(run.hash);
            }
            console.log("Got an error: ", error)
        }
    }

    const sEnd = Date.now();
    console.log(`Time uploading ${req.body.length} runs: ${msToTime(sEnd - sStart)}`)

    let ret = { successes: successCount } as any;
    if (duplicateCount > 0) {
        ret.duplicateCount = duplicateCount
        ret.duplicates = duplicates;
    }
    if (otherErrorCount > 0) {
        ret.otherErrorCount = otherErrorCount;
        ret.otherErrors = otherErrors;
    }

    return res.status(201).send(ret);
});

app.get('/user/:id/runs', async (req, res) => {
    // TODO: paginate this based on query params
    if (isNaN(parseInt(req.params.id, 10))) {
        return res.status(400).send("Bad user ID");
    }

    const runs = await sequelize.query(`SELECT * FROM Runs WHERE Runs.UserId = ${parseInt(req.params.id, 10)}`, { type: QueryTypes.SELECT });
    console.log(runs);

    return res.status(200).send(runs);
});

app.get('/run/:id', async (req, res) => {
    if (isNaN(parseInt(req.params.id, 10))) {
        return res.status(400).send("Bad run ID");
    }

    // TODO: rehydrate all the spins, get into the correct format, and then send back

    const runDetails = await Run.findOne({
        where: {
            id: parseInt(req.params.id, 10),
        },
        include: [
            { model: Spin, separate: true },
            { model: SymbolDetails, separate: true },
            { model: ItemDetails, separate: true },
            { model: SymbolDetailsByRent, separate: true },
            { model: ItemDetailsByRent, separate: true }
        ],
        benchmark: true
    });

    if (runDetails === null) {
        return res.status(404).send();
    }


    return res.status(200).send(runDetails);
});

app.get('/user/:id/run/:runNumber', async (req, res) => {
    if (isNaN(parseInt(req.params.id, 10))) {
        return res.status(400).send({ "error": "Bad user ID" });
    }
    if (isNaN(parseInt(req.params.runNumber, 10))) {
        return res.status(400).send({ "error": "Bad run number" });
    }

    const runDetails = await Run.findOne({
        where: {
            number: parseInt(req.params.runNumber, 10),
            UserId: parseInt(req.params.id, 10),
        },
        include: [
            { model: Spin, separate: true },
            { model: SymbolDetails, separate: true },
            { model: ItemDetails, separate: true },
            { model: SymbolDetailsByRent, separate: true },
            { model: ItemDetailsByRent, separate: true }
        ],
        benchmark: true
    });

    if (runDetails === null) {
        return res.status(404).send();
    }

    return res.status(200).send(runDetails);
})

app.get('/user/:id/stats', async (req, res) => {
    if (isNaN(parseInt(req.params.id, 10))) {
        return res.status(400).send("Bad user ID");
    }

    const stats = await sequelize.query(userStatsQuery, {
        type: QueryTypes.SELECT,
        replacements: { userId: req.params.id }
    });

    return res.status(200).send(stats);
});

app.get('/symbolStats', async (req, res) => {
    const stats = await sequelize.query(symbolWinratesQuery, { type: QueryTypes.SELECT });

    // TODO: Account for versions in here. Not sure how exactly to store versions, could do
    // major/minor/patch as separate smallints? so then the query looks like
    // MAJOR >= 1 AND MINOR >= 2. That could work for everything, because 0 means select everything

    return res.status(200).send(stats);
});

app.get('/itemStats', async (req, res) => {
    const stats = await sequelize.query(itemWinratesQuery, { type: QueryTypes.SELECT });

    // TODO: Account for versions in here. Not sure how exactly to store versions, could do
    // major/minor/patch as separate smallints? so then the query looks like
    // MAJOR >= 1 AND MINOR >= 2. That could work for everything, because 0 means select everything

    console.log("new new Item stats!")

    return res.status(200).send(stats);
});

app.get('/essenceStats', async (req, res) => {
    const stats = await sequelize.query(essenceWinratesQuery, { type: QueryTypes.SELECT });

    // TODO: Account for versions in here. Not sure how exactly to store versions, could do
    // major/minor/patch as separate smallints? so then the query looks like
    // MAJOR >= 1 AND MINOR >= 2. That could work for everything, because 0 means select everything

    console.log("new new Item stats!")

    return res.status(200).send(stats);
});

app.get('/mainStats', async (req, res) => {
    const userCount = await User.count();
    const runCount = await Run.count();

    const ret = {
        'userCount': userCount,
        'runCount': runCount,
    }
    return res.status(200).send(ret);
});

app.get('/bestPlayers', async (req, res) => {
    console.log("asdfgasfasdfasdasdff")
    const stats = await sequelize.query(bestUsersQuery, {
        type: QueryTypes.SELECT,
        replacements: { userCount: 5, minGames: 80 }
    });

    return res.status(200).send(stats);
})

app.get('/symbol/:symbol/details', async (req, res) => {
    return res.status(200).send();
});

app.get('/symbol/:symbol/with/:symbol2', async (req, res) => {
    const statsTogether = await sequelize.query(symbolPairsQuery, {
        type: QueryTypes.SELECT,
        replacements: {
            symbol1: req.params.symbol,
            symbol2: req.params.symbol2,
        }
    });

    const statsSymbol1 = await sequelize.query(symbolsApartQuery, {
        type: QueryTypes.SELECT,
        replacements: {
            symbol1: req.params.symbol,
            symbol2: req.params.symbol2,
        }
    });

    const statsSymbol2 = await sequelize.query(symbolsApartQuery, {
        type: QueryTypes.SELECT,
        replacements: {
            symbol1: req.params.symbol2,
            symbol2: req.params.symbol,
        }
    });

    const totalGames = await Run.count({
        where: {
            date: {
                [Op.gt]: 1668507128000
            }
        }
    });

    // ALSO TODO here: take patch parameters
    console.log("Don't forget");

    const ret = {
        WinRateTogether: (statsTogether[0] as any).win_rate,
        WinRateSymbol1: (statsSymbol1[0] as any).win_rate,
        WinRateSymbol2: (statsSymbol2[0] as any).win_rate,
        GamesTogether: (statsTogether[0] as any).total_games,
        GamesApartSymbol1: (statsSymbol1[0] as any).total_games,
        GamesApartSymbol2: (statsSymbol2[0] as any).total_games,
        TotalTotalGames: totalGames,
    }

    return res.status(200).send(ret);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Route Info //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

var routes: any = [];

app._router.stack.forEach((middleware: any) => {
    if (middleware.route) { // routes registered directly on the app
        routes.push(middleware.route);
    }
});

console.log("Routes:", routes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// DEV ONLY ////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

app.delete('/resetDB', async (req, res) => {
    await sequelize.sync({ force: true });
    await initializeSymbols();

    return res.status(200).send();
})