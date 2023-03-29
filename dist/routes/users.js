"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../database/index");
const discordHook_1 = require("../utils/discordHook");
const sendEmail_1 = require("../utils/sendEmail");
exports.usersRouter = express_1.default.Router();
// rota para criar usuários
exports.usersRouter.post('/users', async (req, res) => {
    try {
        const { name, email, phone, gender, country } = req.body;
        if (!name || !email || !phone || !gender || !country) {
            return res.status(400).json({ message: 'Falta informações no formulário!' });
        }
        //Conectar com o banco de dados
        const db = await (0, index_1.connectDB)();
        // Inserir o usuário na base de dados
        const result = await db.run(`INSERT INTO users (name, email, phone, gender, country) VALUES (?,?,?,?,?)`, [name, email, phone, gender, country]);
        const user = await db.get(`SELECT * FROM users WHERE id = ?`, result.lastID);
        // chamando o webhook
        await (0, discordHook_1.sendDiscordWebHook)(user);
        await (0, sendEmail_1.sendWelcomeEmail)(user.email);
        // return the user data
        res.status(201).json({ message: 'Usuário criado com Sucesso', user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro do servidor interno!' });
    }
});
exports.usersRouter.post('/:id/persons', async (req, res) => {
    const { personName, personAge, personClass, personStr, personCon, personCha, personWis, personInt, personDex, personMaxPV, personSkills } = req.body;
    const userId = req.params.id;
    const db = await (0, index_1.connectDB)();
    try {
        const result = await db.run(`INSERT INTO person(personName, personAge, personClass, personStr, personCon, personCha, personWis, personInt, personDex, personMaxPV, personSkills, userId) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [personName, personAge, personClass, personStr, personCon, personCha, personWis, personInt, personDex, personMaxPV, personSkills, userId]);
        const personId = result.lastID;
        res.status(201).send(Object.assign({ id: personId }, req.body));
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error creating person');
    }
});
// Rota para consultar usuários
exports.usersRouter.get('/users', async (req, res) => {
    try {
        const db = await (0, index_1.connectDB)();
        const users = await db.all(`SELECT * FROM users`);
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro  do servidor interno' });
    }
});
exports.usersRouter.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, index_1.connectDB)();
        const user = await db.get(`SELECT * FROM users where id = ?`, id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
        res.json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro do servidor interno' });
    }
});
exports.usersRouter.get('/users/:id/persons', async (req, res) => {
    const db = await (0, index_1.connectDB)();
    const { id } = req.params;
    try {
        const persons = await db.all('SELECT * FROM person WHERE userId = ?', id);
        res.status(200).json(persons);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching persons' });
    }
    finally {
        await db.close();
    }
});
exports.usersRouter.delete('/clear', async (req, res) => {
    const db = await (0, index_1.connectDB)();
    try {
        await db.run('DELETE FROM person');
        await db.run('DELETE FROM users');
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error clearing database');
    }
});
//# sourceMappingURL=users.js.map