"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersPassword = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const bcrypt_2 = require("bcrypt");
const mysqlDatabase_1 = require("../database/mysqlDatabase");
exports.usersPassword = express_1.default.Router();
exports.usersPassword.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
    return hashedPassword;
}
exports.usersPassword.post('/createPassword', async (req, res) => {
    const { email, password } = req.body;
    // Verificar se há informações insuficientes
    if (!email || !password) {
        return res.status(400).json({ message: 'Falta informações no formulário!' });
    }
    try {
        // Conectar ao banco de dados
        const db2 = await (0, mysqlDatabase_1.connect)();
        // Obter o ID do usuário com base no email fornecido
        const [[{ id }]] = await db2.execute('SELECT id FROM users WHERE email = ?', [email]);
        // Verificar se o usuário já possui senha cadastrada
        const [[result]] = await db2.execute('SELECT password FROM userAuthentication WHERE userID = ?', [id]);
        if (result) {
            return res.status(400).json({ message: 'O usuário já possui senha cadastrada.' });
        }
        // Criar hash da senha usando bcrypt
        const hashedPassword = await (0, bcrypt_2.hash)(password, 10);
        // Inserir o hash de senha na tabela userAuthentication, juntamente com o ID do usuário
        const [{ insertId }] = await db2.execute('INSERT INTO userAuthentication (userID, password) VALUES (?, ?)', [id, hashedPassword]);
        // Enviar resposta com sucesso
        res.status(201).json({ message: 'Senha criada com sucesso!' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro do servidor interno!' });
    }
});
//# sourceMappingURL=password.js.map