import sqlite3 from 'sqlite3';
import { open } from 'sqlite';



// criar uma conexão com a base de dados sqlLite
export async function connectDB() {
    const db = await open({
      filename: './mydb.sqlite',
      driver: sqlite3.Database,
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
    `)
  
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
  
  // fechar conexão com a base de dados
  export async function closeDB(db) {
    await db.close();
  }

 