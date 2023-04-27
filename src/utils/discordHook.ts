import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()

const discordWebHook1 = process.env.DISCORD_WBHOOK_1;
const discordWebHook2 = process.env.DISCORD_WBHOOK_2;


export async function sendDiscordWebHook(user){
    try{
        await axios.post(`https://discord.com/api/webhooks/${discordWebHook1}/${discordWebHook2}`, {
            content: JSON.stringify({ user } )
        });
        console.log('Webhook enviado com sucesso!');
    }catch(error){
        console.error('Erro ao enviar o webhook', error)
    }
}