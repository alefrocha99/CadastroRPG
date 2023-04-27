import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()

const discordWebHook = process.env.DISCORD_WBHOOK;

export async function sendDiscordWebHook(user){
    try{
        await axios.post(`https://discord.com/api/webhooks/${discordWebHook}`, {
            content: JSON.stringify({ user } )
        });
        console.log('Webhook enviado com sucesso!');
    }catch(error){
        console.error('Erro ao enviar o webhook', error)
    }
}