import express from 'express';
import bcrypt from 'bcrypt';
import { hash } from 'bcrypt';
import {connect} from '../database/mysqlDatabase'
import { OkPacket, RowDataPacket } from 'mysql2/promise';


export const usersPassword = express.Router();

usersPassword.use((req: express.Request, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
  

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
  


  usersPassword.post('/createPassword', async (req, res) => {
    const { email, password } = req.body;
  
    // Verificar se há informações insuficientes
    if (!email || !password) {
      return res.status(400).json({ message: 'Falta informações no formulário!' });
    }
  
    try {
      // Conectar ao banco de dados
      const db2 = await connect();
  
      // Obter o ID do usuário com base no email fornecido
      const [[{ id }]] = await db2.execute('SELECT id FROM users WHERE email = ?', [email]) as RowDataPacket[][];
  
      // Verificar se o usuário já possui senha cadastrada
      const [[result]] = await db2.execute('SELECT password FROM userAuthentication WHERE userID = ?', [id]) as RowDataPacket[][];
      if (result) {
        return res.status(400).json({ message: 'O usuário já possui senha cadastrada.' });
      }
  
      // Criar hash da senha usando bcrypt
      const hashedPassword = await hash(password, 10);
  
      // Inserir o hash de senha na tabela userAuthentication, juntamente com o ID do usuário
      const [{ insertId }] = await db2.execute('INSERT INTO userAuthentication (userID, password) VALUES (?, ?)', [id, hashedPassword]) as OkPacket[];
  
      // Enviar resposta com sucesso
      res.status(201).json({ message: 'Senha criada com sucesso!' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro do servidor interno!' });
    }
  });


