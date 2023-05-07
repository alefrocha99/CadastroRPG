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
const mysqlDatabase_1 = require("../database/mysqlDatabase");
exports.usersRouter = express_1.default.Router();
exports.usersRouter.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// rota para criar usuários
exports.usersRouter.post('/users2', async (req, res) => {
    try {
        const { name, email, phone, gender, country, origin } = req.body;
        if (!name || !email || !phone || !gender || !country || !origin) {
            return res.status(400).json({ message: 'Falta informações no formulário!' });
        }
        //Conectar com o banco de dados
        const db2 = await (0, mysqlDatabase_1.connect)();
        // Inserir o usuário na base de dados
        const [result] = await db2.query(`INSERT INTO users (name, email, phone, gender, country, created_at, origin) VALUES (?,?,?,?,?,now(),?)`, [name, email, phone, gender, country, origin]);
        const { insertId } = result;
        const [user] = await db2.query(`SELECT * FROM users WHERE id = ?`, [insertId]);
        // chamando o webhook
        await (0, discordHook_1.sendDiscordWebHook)(user);
        // chamando o envio de mensagem de boas vindas
        await (0, sendEmail_1.sendWelcomeEmail)(user[0].email);
        // return the user data
        res.status(201).json({ message: 'Usuário criado com Sucesso', user: user[0] });
    }
    catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Este endereço de email já está em uso' });
        }
        else {
            res.status(500).json({ message: 'Erro do servidor interno!' });
        }
    }
});
// Rota para consultar usuários
exports.usersRouter.get('/users', async (req, res) => {
    try {
        const db2 = await (0, mysqlDatabase_1.connect)();
        const users = await db2.query(`SELECT * FROM users`);
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro  do servidor interno' });
    }
});
//Consultar usuarios por id
exports.usersRouter.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db2 = await (0, mysqlDatabase_1.connect)();
        const user = await db2.query(`SELECT * FROM users where id = ?`, id);
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
exports.usersRouter.delete('/clear', async (req, res) => {
    const db2 = await (0, mysqlDatabase_1.connect)();
    try {
        await db2.query('DELETE FROM person');
        await db2.query('DELETE FROM users');
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error clearing database');
    }
});
exports.usersRouter.delete('/users/:id/persons', async (req, res) => {
    const db2 = await (0, mysqlDatabase_1.connect)();
    const { id } = req.params;
    try {
        await db2.query('DELETE FROM person where id = ?', id);
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Erro ao deleter o personagem');
    }
});
exports.usersRouter.post('/resetPassword', async (req, res) => {
    const db = await (0, index_1.connectDB)();
    const { email } = req.body;
    const resultado = await db.get(`SELECT userAuthentication.password, users.email FROM users LEFT JOIN userAuthentication ON userAuthentication.userid = users.id WHERE email = $1`, [email]);
    console.log(resultado);
});
// usersRouter.get('/usersCount/:date', async (req, res)=>{
//   const { date } = req.params;
//   try{
//    const db2 = await connect();
//       const result = await db2.query(`SELECT COUNT(id) as count FROM users WHERE DATE(created_at) = ?`, date);
//       const count = parseInt(result[0]?.count || '0');
//       res.json({count});
//   }catch(err){
//       console.error(err);
//       res.status(500).json({message:'Erro  do servidor interno'});
//   }
// })
// usersRouter.post('/userAuthentication/', async (req, res) => {
//   const db2 = await connectDB();
//   const { email, password } = req.body;
//   try {
//     // Busca o usuário com base no e-mail fornecido
//     const user = await db2.query('SELECT * FROM users WHERE email = ?', [email]);
//     if (!user) {
//       return res.status(401).send('Usuário não encontrado');
//     }
//     // Busca a senha armazenada do usuário na tabela userAuthentication
//     const authInfo = await db2.query('SELECT * FROM userAuthentication WHERE userid = ?', [user.id]);
//     if (!authInfo) {
//       return res.status(401).send('Usuário não encontrado');
//     }
//     // Compara a senha inserida pelo usuário com a senha armazenada usando bcrypt.compare()
//     const isMatch = await bcrypt.compare(password, authInfo.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Senha incorreta' });
//     }
//     return res.status(200).json({ message: 'Autenticação bem sucedida' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Erro interno do servidor' });
//   }
// });
//# sourceMappingURL=users%20copy.js.map