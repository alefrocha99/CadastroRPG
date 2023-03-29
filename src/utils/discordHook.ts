import axios from 'axios';


export async function sendDiscordWebHook(user){
    try{
        await axios.post('https://discord.com/api/webhooks/1089742476832682004/rTM3hpkn-5aGfzGsyDAe1DskjId3yog53MiB-Bc6xLm3ae5MiOUaD8wCoWetDYTxpxPe', {
            content: JSON.stringify({ user } )
        });
        console.log('Webhook enviado com sucesso!');
    }catch(error){
        console.error('Erro ao enviar o webhook', error)
    }
}