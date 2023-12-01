"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const mapStringify_1 = require("../common/utils/mapStringify");
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
db_1.sequelize.sync({ force: true }).then(() => console.log("DB has been synced."));
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
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.username && req.username !== req.body.username) {
        console.log(`Received registration request when user already logged in: username: ${req.username}`);
        return res.status(403).send();
    }
    const userInDB = yield user_1.User.findOne({ where: { username: req.body.username } });
    if (userInDB != null) {
        return res.status(409).send("User already exists");
    }
    const { username, password } = req.body;
    const safePass = yield bcrypt_1.default.hash(password, 10);
    const data = {
        username,
        password: safePass
    };
    const user = yield user_1.User.create(data);
    if (user) {
        let token = jsonwebtoken_1.default.sign({ username: username, id: user.id }, exports.JWT_SECRET, { expiresIn: DAY });
        res.cookie("jwt", token, { maxAge: DAY, httpOnly: true });
        console.log(`User registered: ${username}, ${token}`);
        return res.status(201).send({ id: user.id });
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInDB = yield user_1.User.findOne({ where: { username: req.body.username } });
    const { username, password } = req.body;
    if (userInDB === null) {
        return res.status(401).send("Authentication failed");
    }
    else {
        const isSame = yield bcrypt_1.default.compare(password, userInDB.password);
        if (!isSame) {
            return res.status(401).send("Authentication failed");
        }
        let token = jsonwebtoken_1.default.sign({ username: username }, exports.JWT_SECRET, { expiresIn: DAY });
        res.cookie("jwt", token, { maxAge: DAY, httpOnly: true });
        console.log(`User signed in: ${username}, ${token}`);
        return res.status(200).send({ id: userInDB.id });
    }
}));
app.get('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findOne({ where: { id: req.params.id } });
    if (!user) {
        return res.status(404).send();
    }
    return res.status(200).send({ username: user.username });
}));
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Run Controls ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
app.post('/uploadRuns', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Make sure they are logged in
    if (!req.userId) {
        return res.status(401).send("Not logged in.");
    }
    console.log(req.body);
    for (const run of req.body) {
        const symbolDetails = [];
        for (const symbol of run.details.showsPerSymbol.keys()) {
            const count = run.details.showsPerSymbol.get(symbol);
            const value = run.details.coinsPerSymbol.get(symbol);
            symbolDetails.push({ symbol, value, count });
        }
        const spinSymbols = [];
        yield run_1.Run.create({
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
            // CoinsPerSymbols: run.details.coinsPerSymbol.value.map((a: any) => { return { symbol: a[0], value: a[1] }; }),
            // ShowsPerSymbols: run.details.showsPerSymbol.value.map((a: any) => { return { symbol: a[0], count: a[1] }; }),
            SymbolDetails: symbolDetails,
            Spins: run.details.spins.map((spin, idx) => {
                const spinSymbols = [];
                for (let i = 0; i < 20; i++) {
                    spinSymbols.push({
                        symbol: spin.symbols[i],
                        value: spin.values[i],
                        index: i,
                    });
                }
                return {
                    coinsEarned: spin.coinsEarned,
                    totalCoins: spin.totalCoins,
                    number: idx,
                    SpinSymbols: spinSymbols,
                };
            }),
        }, {
            include: [run_1.SymbolDetails, { model: run_1.Spin, include: [run_1.SpinSymbol] }]
        });
        // TODO: Finish uploading runs by uploading the actual symbols of each spin
    }
    return res.status(201).send();
}));
app.get('/user/:id/runs', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: paginate this based on query params
    if (isNaN(parseInt(req.params.id, 10))) {
        return res.status(400).send("Bad user ID");
    }
    const [runs, _] = yield db_1.sequelize.query(`SELECT * FROM Runs WHERE Runs.UserId = ${parseInt(req.params.id, 10)}`);
    console.log(runs);
    return res.status(200).send(runs);
}));
app.get('/run/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(parseInt(req.params.id, 10))) {
        return res.status(400).send("Bad run ID");
    }
    // const [coins, _coinMeta] = await sequelize.query(`SELECT * FROM CoinsPerSymbols WHERE CoinsPerSymbols.RunId = ${parseInt(req.params.id, 10)}`, { benchmark: true });
    // const [shows, _showMeta] = await sequelize.query(`SELECT * FROM ShowsPerSymbols WHERE ShowsPerSymbols.RunId = ${parseInt(req.params.id, 10)}`, { benchmark: true });
    // const [spins, _spinMeta] = await sequelize.query(`SELECT * FROM Spins WHERE Spins.RunId = ${parseInt(req.params.id, 10)}`, { benchmark: true });
    // TODO: rehydrate all the spins, get into the correct format, and then send back
    // 3.7 SECONDS TO RUN THIS QUERY if not separate
    // This does grab everything. Now just need to reformat it into a nicer style.
    const runDetails = yield run_1.Run.findOne({
        where: {
            id: parseInt(req.params.id, 10),
        },
        include: [{ model: run_1.CoinsPerSymbol, separate: true }, { model: run_1.ShowsPerSymbol, separate: true }, { model: run_1.Spin, separate: true, include: [{ model: run_1.SpinSymbol, separate: true }] }, { model: run_1.SymbolDetails, separate: true }],
        benchmark: true
    });
    return res.status(200).send(runDetails);
}));
app.get('/user/:id/stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(parseInt(req.params.id, 10))) {
        return res.status(400).send("Bad user ID");
    }
    const [stats, _] = yield db_1.sequelize.query(`SELECT
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
}));
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
