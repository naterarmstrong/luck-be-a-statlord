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
const uuid_1 = require("uuid");
const sessionController_1 = require("./controllers/sessionController");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userAuth_1 = require("./middleware/userAuth");
const user_1 = require("./models/user");
const db_1 = require("./db/db");
const secrets = dotenv_1.default.config();
// Temporary secret for use in testing, later this should come from dotenv
exports.JWT_SECRET = "asdf";
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const sessionController = new sessionController_1.SessionController();
const corsOptions = {
    // For now, this allows any request origin to send things in via browser. Once deployed, maybe
    // this should change or be set by an env variable.
    origin: true,
    // We need to allow credentials to allow sending the JWT token used for authentication
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
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
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.loggedIn && req.loggedIn !== req.body.username) {
        console.log(`Received registration request when user already logged in: username: ${req.loggedIn}`);
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
        let token = jsonwebtoken_1.default.sign({ username: username }, exports.JWT_SECRET, { expiresIn: DAY });
        res.cookie("jwt", token, { maxAge: DAY, httpOnly: true });
        console.log(`User registered: ${username}, ${token}`);
        return res.status(201).send();
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
        return res.status(200).send();
    }
}));
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
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.log("LOGGING ERROR")
//     console.error(err);
//     res.status(res.status || 500).json({
//         message: err.message,
//         errors: err.errors,
//     });
// });
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
