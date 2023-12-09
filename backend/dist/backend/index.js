"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userAuth_1 = require("./middleware/userAuth");
const user_1 = require("./models/user");
const run_1 = require("./models/run");
const db_1 = require("./db/db");
const mapStringify_1 = require("../frontend/src/common/utils/mapStringify");
const time_1 = require("../frontend/src/common/utils/time");
const symbol_1 = require("./models/symbol");
const sequelize_1 = require("sequelize");
const secrets = dotenv_1.default.config();
// Temporary secret for use in testing, later this should come from dotenv
exports.JWT_SECRET = "asdf";
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const corsOptions = {
    // For now, this allows any request origin to send things in via browser. Once deployed, maybe
    // this should change or be set by an env variable.
    origin: true,
    // We need to allow credentials to allow sending the JWT token used for authentication
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json({ limit: '50mb', reviver: mapStringify_1.reviver }));
app.use((0, morgan_1.default)('combined'));
app.use('/spec', express_1.default.static('./api.yaml'));
app.use(userAuth_1.checkLogin);
db_1.sequelize.sync().then(async () => {
    console.log("DB has been synced.");
    await (0, symbol_1.initializeSymbols)();
    console.log("Symbols have been initialized.");
});
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
app.post('/register', async (req, res) => {
    if (req.username && req.username !== req.body.username) {
        console.log(`Received registration request when user already logged in: username: ${req.username}`);
        return res.status(403).send();
    }
    const userInDB = await user_1.User.findOne({ where: { username: req.body.username } });
    if (userInDB != null) {
        return res.status(409).send("User already exists");
    }
    const { username, password } = req.body;
    const safePass = await bcrypt_1.default.hash(password, 10);
    const data = {
        username,
        password: safePass
    };
    const user = await user_1.User.create(data);
    if (user) {
        let token = jsonwebtoken_1.default.sign({ username: username, id: user.id }, exports.JWT_SECRET, { expiresIn: DAY });
        res.cookie("jwt", token, { maxAge: DAY, httpOnly: true });
        console.log(`User registered: ${username}, ${token}`);
        return res.status(201).send({ id: user.id });
    }
});
app.post('/login', async (req, res) => {
    const userInDB = await user_1.User.findOne({ where: { username: req.body.username } });
    const { username, password } = req.body;
    if (userInDB === null) {
        return res.status(404).send("User does not exist.");
    }
    else {
        const isSame = await bcrypt_1.default.compare(password, userInDB.password);
        if (!isSame) {
            return res.status(401).send("Wrong password.");
        }
        let token = jsonwebtoken_1.default.sign({ username: username, id: userInDB.id }, exports.JWT_SECRET, { expiresIn: DAY });
        res.cookie("jwt", token, { maxAge: DAY, httpOnly: true });
        console.log(`User signed in: ${username}, ${token}`);
        return res.status(200).send({ id: userInDB.id });
    }
});
app.get('/user/:id', async (req, res) => {
    const user = await user_1.User.findOne({ where: { id: req.params.id } });
    if (!user) {
        return res.status(404).send();
    }
    return res.status(200).send({ username: user.username });
});
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Run Controls ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
app.post('/uploadRuns', async (req, res) => {
    // Make sure they are logged in
    if (!req.userId) {
        return res.status(401).send("Not logged in.");
    }
    let duplicateCount = 0;
    let otherErrorCount = 0;
    let successCount = 0;
    let duplicates = [];
    let otherErrors = [];
    const sStart = Date.now();
    // console.log(req.body)
    for (const run of req.body) {
        const symbolDetails = [];
        for (const symbol of run.details.showsPerSymbol.keys()) {
            const count = run.details.showsPerSymbol.get(symbol);
            const value = run.details.coinsPerSymbol.get(symbol);
            symbolDetails.push({ symbol, value, count });
        }
        try {
            await run_1.Run.create({
                UserId: req.userId,
                hash: run.hash,
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
                SymbolDetails: symbolDetails,
                Spins: run.details.spins.map((spin, idx) => {
                    return {
                        coinsEarned: spin.coinsEarned,
                        totalCoins: spin.totalCoins,
                        number: idx,
                        Symbols: spin.symbols.join(','),
                        Values: spin.values.join(','),
                        Extras: spin.symbolExtras.join(','),
                    };
                }),
            }, {
                include: [run_1.SymbolDetails, run_1.Spin],
                benchmark: true,
                logging: false,
            });
            successCount += 1;
            // TODO: Finish uploading runs by uploading the actual symbols of each spin
        }
        catch (error) {
            if (error.errors && error.errors.length == 1 && error.errors[0].type === "unique violation") {
                console.log("Got a duplicate!");
                duplicateCount += 1;
                duplicates.push(run.hash);
            }
            else {
                otherErrorCount += 1;
                otherErrors.push(run.hash);
            }
            // console.log("Got an error: ", error)
        }
    }
    const sEnd = Date.now();
    console.log(`Time uploading ${req.body.length} runs: ${(0, time_1.msToTime)(sEnd - sStart)}`);
    let ret = { successes: successCount };
    if (duplicateCount > 0) {
        ret.duplicateCount = duplicateCount;
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
    const runs = await db_1.sequelize.query(`SELECT * FROM Runs WHERE Runs.UserId = ${parseInt(req.params.id, 10)}`, { type: sequelize_1.QueryTypes.SELECT });
    console.log(runs);
    return res.status(200).send(runs);
});
app.get('/run/:id', async (req, res) => {
    if (isNaN(parseInt(req.params.id, 10))) {
        return res.status(400).send("Bad run ID");
    }
    // TODO: rehydrate all the spins, get into the correct format, and then send back
    // 3.7 SECONDS TO RUN THIS QUERY if not separate
    // This does grab everything. Now just need to reformat it into a nicer style.
    const runDetails = await run_1.Run.findOne({
        where: {
            id: parseInt(req.params.id, 10),
        },
        include: [{ model: run_1.Spin, separate: true, include: [{ model: run_1.SpinSymbol, separate: true }] }, { model: run_1.SymbolDetails, separate: true }],
        benchmark: true
    });
    return res.status(200).send(runDetails);
});
app.get('/user/:id/stats', async (req, res) => {
    if (isNaN(parseInt(req.params.id, 10))) {
        return res.status(400).send("Bad user ID");
    }
    const stats = await db_1.sequelize.query(db_1.userStatsQuery, {
        type: sequelize_1.QueryTypes.SELECT,
        replacements: { userId: req.params.id }
    });
    return res.status(200).send(stats);
});
app.get('/symbolStats', async (req, res) => {
    const stats = await db_1.sequelize.query(db_1.symbolWinratesQuery, { type: sequelize_1.QueryTypes.SELECT });
    // TODO: Account for versions in here. Not sure how exactly to store versions, could do
    // major/minor/patch as separate smallints? so then the query looks like
    // MAJOR >= 1 AND MINOR >= 2. That could work for everything, because 0 means select everything
    return res.status(200).send(stats);
});
app.get('/symbol/:symbol/details', async (req, res) => {
    return res.status(200).send();
});
app.get('/symbol/:symbol/with/:symbol2', async (req, res) => {
    const statsTogether = await db_1.sequelize.query(db_1.symbolPairsQuery, {
        type: sequelize_1.QueryTypes.SELECT,
        replacements: {
            symbol1: req.params.symbol,
            symbol2: req.params.symbol2,
        }
    });
    const statsSymbol1 = await db_1.sequelize.query(db_1.symbolsApartQuery, {
        type: sequelize_1.QueryTypes.SELECT,
        replacements: {
            symbol1: req.params.symbol,
            symbol2: req.params.symbol2,
        }
    });
    const statsSymbol2 = await db_1.sequelize.query(db_1.symbolsApartQuery, {
        type: sequelize_1.QueryTypes.SELECT,
        replacements: {
            symbol1: req.params.symbol2,
            symbol2: req.params.symbol,
        }
    });
    const ret = {
        WinRateTogether: statsTogether[0].win_rate,
        WinRateSymbol1: statsSymbol1[0].win_rate,
        WinRateSymbol2: statsSymbol2[0].win_rate,
        GamesTogether: statsTogether[0].total_games,
        GamesApartSymbol1: statsSymbol1[0].total_games,
        GamesApartSymbol2: statsSymbol2[0].total_games,
    };
    return res.status(200).send(ret);
});
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Route Info //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
var routes = [];
app._router.stack.forEach((middleware) => {
    if (middleware.route) { // routes registered directly on the app
        routes.push(middleware.route);
    }
});
console.log("Routes:", routes);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// DEV ONLY ////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
app.delete('/resetDB', async (req, res) => {
    await db_1.sequelize.sync({ force: true });
    await (0, symbol_1.initializeSymbols)();
    return res.status(200).send();
});
