"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
exports.client = new discord_js_1.Client({
    intents: [
        discord_js_2.IntentsBitField.Flags.Guilds,
        discord_js_2.IntentsBitField.Flags.GuildMessages
    ]
});
const prefix = "!"; // Prefixo do bot
exports.client.on("ready", () => {
    var _a;
    console.log(`Logged in as ${(_a = exports.client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
});
exports.client.on("message", async (message) => {
    var _a;
    if (!message.content.startsWith(prefix))
        return;
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (command === "person") {
        const id = args[0]; // Extrai o ID após a palavra "Person:"
        try {
            const response = await axios_1.default.get(`http://localhost:80/users/${id}/persons`); // Faz uma requisição GET na API passando o ID como parâmetro
            const persons = response.data; // Extrai a lista de personagens da resposta
            // Envia uma mensagem de resposta contendo a lista de personagens
            message.reply(`Aqui estão os personagens do usuário ${id}: \n${persons.map((p) => `${p.personName} (Classe: ${p.personClass})`).join('\n')}`);
        }
        catch (error) {
            console.error(error);
            message.reply("Houve um erro ao buscar a lista de personagens.");
        }
    }
});
function startDiscordBot() {
    exports.client.login('MTA4OTc3MzI5NzMzNzYzMDc3MA.GJv1jV.dYdCD6JwHPA28yrh0neXA6HioEBG7uwOpjgyZk')
        .then(() => {
        console.log('Bot está online!');
    })
        .catch(error => {
        console.error('Ocorreu um erro ao tentar logar o bot:', error);
    });
}
startDiscordBot();
//# sourceMappingURL=discordBot.js.map