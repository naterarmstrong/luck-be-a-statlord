"use strict";
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
const sessionController_1 = require("./controllers/sessionController");
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userAuth_1 = require("./middleware/userAuth");
const secrets = dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const io = new socket_io_1.Server(3002, {
    cors: {
        origin: "*"
    }
});
const sessionController = new sessionController_1.SessionController();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('combined'));
app.use('/spec', express_1.default.static('./api.yaml'));
app.use(userAuth_1.checkLogin);
console.log("Starting up");
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
