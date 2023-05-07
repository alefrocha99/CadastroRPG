"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const users_copy_1 = require("../routes/users copy");
const persons_1 = require("../routes/persons");
const password_1 = require("../routes/password");
const corsOptions = {
    origin: 'http://127.0.0.1:5500'
};
const app = (0, express_1.default)();
exports.app = app;
const port = 80;
exports.port = port;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.get('/', (_, res) => {
    res.send('Hello World!');
});
app.use('/users', users_copy_1.usersRouter);
app.use('/:id/persons', persons_1.personsRouter);
app.use('/clear', users_copy_1.usersRouter);
app.use('/users/:id/persons', persons_1.personsRouter);
app.use('/userAuthentication/', users_copy_1.usersRouter);
app.use('/resetPassword', password_1.usersPassword);
app.use('/users2', users_copy_1.usersRouter);
app.use('/usersCount/:date', users_copy_1.usersRouter);
//# sourceMappingURL=server.js.map