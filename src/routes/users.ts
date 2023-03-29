import express from 'express';
import { connectDB } from '../database/index';
import { sendDiscordWebHook } from '../utils/discordHook';
import { sendWelcomeEmail } from '../utils/sendEmail';






export const usersRouter = express.Router();


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
     res.status(500).json({ message: 'Erro do servidor interno!' });
    
    }
     
     
 });

 usersRouter.post('/:id/persons', async (req, res) => {
    const { personName, personAge, personClass, personStr, personCon, personCha, personWis, personInt, personDex, personMaxPV, personSkills } = req.body;
  
    const userId = req.params.id;
    const db = await connectDB();
  
    try {
      const result = await db.run(`INSERT INTO person(personName, personAge, personClass, personStr, personCon, personCha, personWis, personInt, personDex, personMaxPV, personSkills, userId) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                    [personName, personAge, personClass, personStr, personCon, personCha, personWis, personInt, personDex, personMaxPV, personSkills, userId]);
  
      const personId = result.lastID;
  
      res.status(201).send({ id: personId, ...req.body });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating person');
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

