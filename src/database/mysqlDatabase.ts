import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config()

const dbhost = process.env.DB_HOST;
const dbuser = process.env.DB_USER;
const dbpassword = process.env.DB_PASSWORD;
const dbdatabase = process.env.DB_DATABASE;

console.log(dbhost, dbuser, dbpassword, dbdatabase);

export async function connect(){
    try{
        const connection =  await createConnection({
            host: dbhost,
            user: dbuser,
            password: dbpassword,
            database: dbdatabase
        });

        const users = `CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(30) NOT NULL,
        gender VARCHAR(50) NOT NULL,
        country VARCHAR(50) NOT NULL,
        PRIMARY KEY (id)
        )
        `
       

        const userAuthentication = `
        CREATE TABLE IF NOT EXISTS userAuthentication (
          id INTEGER PRIMARY KEY AUTO_INCREMENT,
          password TEXT NOT NULL,
          userId INTEGER NOT NULL,
          FOREIGN KEY (userID) REFERENCES users (id)
        )    
      `
        const persons = `
        CREATE TABLE IF NOT EXISTS person (
          id INTEGER PRIMARY KEY AUTO_INCREMENT,
          personName TEXT NOT NULL,
          personAge TINYINT NOT NULL,
          personClass TEXT NOT NULL,
          personStr TINYINT NOT NULL,
          personCon TINYINT NOT NULL,
          personCha TINYINT NOT NULL,
          personWis TINYINT NOT NULL,
          personInt TINYINT NOT NULL,
          personDex TINYINT NOT NULL,
          personMaxPV TINYINT NOT NULL,
          personSkills TEXT NOT NULL,
          userId INT NOT NULL,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `

   


        await connection.query(users);
        await connection.query(userAuthentication);
        await connection.query(persons);
        

        console.log( "Connected to database!");
        return connection;

    }catch(error){
        console.error("Error connecting to database!", error);
    }
    }


