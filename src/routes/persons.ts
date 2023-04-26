import express from 'express';
import { connectDB } from '../database/index';
import {connect} from '../database/mysqlDatabase'

export const personsRouter = express.Router();

personsRouter.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
  


personsRouter.post('/:id/persons', async (req, res) => {
    const { personName, personAge, personClass, personStr, personCon, personCha, personWis, personInt, personDex, personMaxPV, personSkills } = req.body;
  
    const userId = req.params.id;
    const db2 = await connect();
  
    try {
      const personSkillsString = JSON.stringify(personSkills);
      const [result] = await db2.query(`INSERT INTO person(personName, personAge, personClass, personStr, personCon, personCha, personWis, personInt, personDex, personMaxPV, personSkills, userId) 
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                  [personName, personAge, personClass, personStr, personCon, personCha, personWis, personInt, personDex, personMaxPV, personSkillsString, userId]);
console.log([result]);
const personId = result;
  
      res.status(201).send({ id: personId, ...req.body });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao criar um personagem');
    }
  });



  personsRouter.get('/users/:id/persons', async (req, res) => {
    const db2 = await connect();
    const { id } = req.params;
  
    try {
      const persons = await db2.query('SELECT * FROM person WHERE userId = ?', id);
      res.status(200).json(persons);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error fetching persons' });
    } 
  });