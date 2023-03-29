"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("./routes/users");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(users_1.usersRouter);
app.listen(3000, () => console.log('Server running on port 3000'));
//# sourceMappingURL=index.js.map