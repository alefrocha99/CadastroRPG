"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../database/database");
const router = express_1.default.Router();
router.get('/logs', async (req, res) => {
    try {
        const logs = await (0, database_1.getAllLogs)();
        res.status(200).json(logs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.default = router;
//# sourceMappingURL=logs.js.map