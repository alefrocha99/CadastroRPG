"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDB = exports.connectDB = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
// criar uma conexão com a base de dados sqlLite
async function connectDB() {
    const db = await (0, sqlite_1.open)({
        filename: './mydb.sqlite',
        driver: sqlite3_1.default.Database,
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        gender TEXT NOT NULL,
        country TEXT NOT NULL,
        personId INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (personId) REFERENCES person(id)
      )
    `);
    await db.exec(`
      CREATE TABLE IF NOT EXISTS userAuthentication (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        password TEXT NOT NULL,
        userId INTEGER NOT NULL,
        FOREIGN KEY (userID) REFERENCES users (id)
      )    
    `);
    await db.exec(`
      CREATE TABLE IF NOT EXISTS person (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personName TEXT NOT NULL,
        personAge INTEGER NOT NULL,
        personClass TEXT NOT NULL,
        personStr INTEGER NOT NULL,
        personCon INTEGER NOT NULL,
        personCha INTEGER NOT NULL,
        personWis INTEGER NOT NULL,
        personInt INTEGER NOT NULL,
        personDex INTEGER NOT NULL,
        personMaxPV INTEGER NOT NULL,
        personSkills TEXT NOT NULL,
        userId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
    return db;
}
exports.connectDB = connectDB;
// fechar conexão com a base de dados
async function closeDB(db) {
    await db.close();
}
exports.closeDB = closeDB;
//# sourceMappingURL=index.js.map