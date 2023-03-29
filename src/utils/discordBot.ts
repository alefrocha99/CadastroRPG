import Discord from 'discord.js';
import axios from 'axios';
import { Client } from 'discord.js';
import { IntentsBitField } from 'discord.js'


export const client = new Client({
    intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages
]    });
const prefix = "!"; // Prefixo do bot

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("message", async message => {
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift()?.toLowerCase();

  if (command === "person") {
    const id = args[0]; // Extrai o ID após a palavra "Person:"
    
    try {
      const response = await axios.get(`http://localhost:3000/users/${id}/persons`); // Faz uma requisição GET na API passando o ID como parâmetro
      const persons = response.data; // Extrai a lista de personagens da resposta
      
      // Envia uma mensagem de resposta contendo a lista de personagens
      message.reply(`Aqui estão os personagens do usuário ${id}: \n${persons.map((p: any) => `${p.personName} (Classe: ${p.personClass})`).join('\n')}`);
    } catch (error) {
      console.error(error);
      message.reply("Houve um erro ao buscar a lista de personagens.");
    }
  }
});

function startDiscordBot() {
 
  client.login('MTA4OTc3MzI5NzMzNzYzMDc3MA.GSaU5I.4RSl6YnZa3k12NHth6H3Wf56c-ae0DQVRWZy1g')
    .then(() => {
      console.log('Bot está online!');
    })
    .catch(error => {
      console.error('Ocorreu um erro ao tentar logar o bot:', error);
    });
}

startDiscordBot()
