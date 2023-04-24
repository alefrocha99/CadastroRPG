import express from 'express';
import { connectDB } from '../database/index';
import { sendDiscordWebHook } from '../utils/discordHook';
import { sendWelcomeEmail } from '../utils/sendEmail';
import bcrypt from 'bcrypt';
import {connect} from '../database/mysqlDatabase'



export const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
  

// rota para criar usuários
usersRouter.post('/users', async (req, res) => {
    try{
     const{name, email ,phone, gender, country} = req.body;
 
     if(!name || !email || !phone || !gender || !country){
         return res.status(400).json({message: 'Falta informações no formulário!'});
     }
     
     //Conectar com o banco de dados
     const db = await connectDB();
 
     // Inserir o usuário na base de dados
     const result = await db.run(
         `INSERT INTO users (name, email, phone, gender, country) VALUES (?,?,?,?,?)`,
         [name, email, phone, gender, country]
     );
 
     const user = await db.get(`SELECT * FROM users WHERE id = ?`, result.lastID);
 
     // chamando o webhook
     await sendDiscordWebHook(user);
    
     await sendWelcomeEmail(user.email);

    
     // return the user data
     res.status(201).json({ message: 'Usuário criado com Sucesso', user });
   } catch (err) {
     console.error(err);
     if(err.code === 'SQLITE_CONSTRAINT' && err.message.includes('UNIQUE constraint failed: users.email')){
      res.status(400).json({message: 'Este endereço de email já está em uso'})
     }else{
      res.status(500).json({ message: 'Erro do servidor interno!' });
     }
    
    }
     
     
 });

 usersRouter.post('/:id/persons', async (req, res) => {
    const { personName, personAge, personClass, personStr, personCon, personCha, personWis, personInt, personDex, personMaxPV, personSkills } = req.body;
  
    const userId = req.params.id;
    const db = await connectDB();
  
    try {
      const personSkillsString = JSON.stringify(personSkills);
      const result = await db.run(`INSERT INTO person(personName, personAge, personClass, personStr, personCon, personCha, personWis, personInt, personDex, personMaxPV, personSkills, userId) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                    [personName, personAge, personClass, personStr, personCon, personCha, personWis, personInt, personDex, personMaxPV, personSkillsString, userId]);
  
      const personId = result.lastID;
  
      res.status(201).send({ id: personId, ...req.body });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao criar um personagem');
    }
  });


 
 // Rota para consultar usuários
 usersRouter.get('/users', async (req, res)=>{
     try{
         const db = await connectDB();
         const users = await db.all(`SELECT * FROM users`);
         res.json(users);
 
     }catch(err){
         console.error(err);
         res.status(500).json({message:'Erro  do servidor interno'});
     }

  
 })
 
 
 usersRouter.get('/users/:id', async (req, res)=>{
     try{
         const {id} = req.params;
         const db = await connectDB();
         const user = await db.get(`SELECT * FROM users where id = ?`, id);
         if(!user){
             return res.status(404).json({message:'Usuário não encontrado!'});
         }
         res.json(user);
     }catch(err){
         console.error(err);
         res.status(500).json({message:'Erro do servidor interno'});
 
     }
 })

 usersRouter.get('/users/:id/persons', async (req, res) => {
    const db = await connectDB();
    const { id } = req.params;
  
    try {
      const persons = await db.all('SELECT * FROM person WHERE userId = ?', id);
      res.status(200).json(persons);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error fetching persons' });
    } finally {
      await db.close();
    }
  });
  

 usersRouter.delete('/clear', async (req, res) => {
    const db = await connectDB();
    try {
      await db.run('DELETE FROM person');
      await db.run('DELETE FROM users');
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Error clearing database');
    }
  });


  usersRouter.delete('/users/:id/persons', async (req, res) => {
    const db = await connectDB();
    const { id } = req.params;
    try {
      await db.run('DELETE FROM person where id = ?', id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao deleter o personagem');
    }
  });


  usersRouter.post('/createPassword', async (req, res) => {
    const db = await connectDB();
    const { email, password } = req.body;
     
   
    const resultado = await db.get(`SELECT password FROM users LEFT JOIN userAuthentication ON userAuthentication.userid = users.id WHERE email = $1`, [email]);
    if(resultado.password ===  null){
      // Obter o ID do usuário com base no email fornecido
    const user = await db.get(`SELECT id FROM users WHERE email = $1`, [email]);
  
    // Criar um hash de senha usando bcrypt.hash()
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
  
    // Inserir o hash de senha na tabela userAuthentication, juntamente com o ID do usuário
    await db.run(`INSERT INTO userAuthentication (userID, password) VALUES ($1, $2)`, [user.id, passwordHash]);
  
    res.send('Senha criada com sucesso!');
    }else{
    
      res.status(400).send("O usuário já possui senha cadastrada.")
    
    }

  });


usersRouter.post('/resetPassword', async (req, res)=>{
  const db = await connectDB();
  const {email} = req.body;


  const resultado = await db.get(`SELECT userAuthentication.password, users.email FROM users LEFT JOIN userAuthentication ON userAuthentication.userid = users.id WHERE email = $1`, [email]);
 
  console.log(resultado)

})





  usersRouter.post('/userAuthentication/', async (req, res) => {
    const db = await connectDB();
    const { email, password } = req.body;
  
    try {
      // Busca o usuário com base no e-mail fornecido
      const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  
      if (!user) {
        return res.status(401).send('Usuário não encontrado');
      }
  
      // Busca a senha armazenada do usuário na tabela userAuthentication
      const authInfo = await db.get('SELECT * FROM userAuthentication WHERE userid = ?', [user.id]);
  
      if (!authInfo) {
        return res.status(401).send('Usuário não encontrado');
      }
  
      // Compara a senha inserida pelo usuário com a senha armazenada usando bcrypt.compare()
      const isMatch = await bcrypt.compare(password, authInfo.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Senha incorreta' });
      }
  
      return res.status(200).json({ message: 'Autenticação bem sucedida' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });




//   usersRouter.post('/users2', async (req, res) => {
//     try{
//      const{name, email ,phone, gender, country} = req.body;
 
//      if(!name || !email || !phone || !gender || !country){
//          return res.status(400).json({message: 'Falta informações no formulário!'});
//      }
     
//      //Conectar com o banco de dados
//      const db2 = await connect();
 
//      // Inserir o usuário na base de dados
//      const [result] = await db2.query(
//          `INSERT INTO users (name, email, phone, gender, country) VALUES (?,?,?,?,?)`,
//          [name, email, phone, gender, country]
//      );
 
//      const [user] = await db2.execute(`SELECT * FROM users WHERE id = ?`, result[0].lastID);
 
//      // chamando o webhook
//      await sendDiscordWebHook(user);
    
//      await sendWelcomeEmail(user[0].email);

    
//      // return the user data
//      res.status(201).json({ message: 'Usuário criado com Sucesso', user:user });
//    } catch (err) {
//      console.error(err);
//      if(err.code === 'ER_DUP_ENTRY'){
//       res.status(400).json({message: 'Este endereço de email já está em uso'})
//      }else{
//       res.status(500).json({ message: 'Erro do servidor interno!' });
//      }
    
//     }
     
     
//  });