"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUsers = exports.sendWelcomeEmailToLastUser = exports.createUser = void 0;
const database_1 = require("../database");
const discord_1 = require("../utils/discord");
const mailer_1 = require("../utils/mailer");
const createUser = async (req, res) => {
    try {
        const { name, email, phone, gender, country } = req.body;
        if (!name || !email || !phone || !gender || !country) {
            return res.status(400).json({ message: 'Falta informações no formulário!' });
        }
        //Conectar com o banco de dados
        const db = await (0, database_1.connectDB)();
        // Inserir o usuário na base de dados
        const result = await db.run(`INSERT INTO users (name, email, phone, gender, country) VALUES (?,?,?,?,?)`, [name, email, phone, gender, country]);
        const user = await db.get(`SELECT * FROM users WHERE id = ?`, result.lastID);
        // chamando o webhook
        await (0, discord_1.sendDiscordWebHook)(user);
        // return the user data
        res.status(201).json({ message: 'Usuário criado com Sucesso', user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro do servidor interno!' });
    }
};
exports.createUser = createUser;
const sendWelcomeEmailToLastUser = async (req, res) => {
    try {
        const db = await (0, database_1.connectDB)();
        const user = await db.get('SELECT * FROM users ORDER BY id DESC LIMIT 1');
        if (!user) {
            return res.status(404).send('Nenhum usuário encontrado!');
        }
        const { name, email } = user;
        await (0, mailer_1.sendEmail)(email, `Bem-vindo(a) ao meu site, ${name}!`, `Olá, ${name}!\n\nBem-vindo(a) ao meu site!`);
        res.status(200).send(`E-mail de boas-vindas enviado para ${email}`);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Erro ao enviar e-mail de boas-vindas!');
    }
};
exports.sendWelcomeEmailToLastUser = sendWelcomeEmailToLastUser;
const getUsers = async (req, res) => {
    try {
        const db = await (0, database_1.connectDB)();
        const users = await db.all(`SELECT * FROM users`);
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro do servidor interno!' });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, database_1.connectDB)();
        const user = await db.get(`SELECT * FROM users where id = ?`, id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
        res.json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro do servidor interno!' });
    }
};
exports.getUserById = getUserById;
//# sourceMappingURL=users.controller.js.map