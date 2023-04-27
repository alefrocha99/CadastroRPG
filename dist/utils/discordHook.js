"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDiscordWebHook = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const discordWebHook1 = process.env.DISCORD_WBHOOK_1;
const discordWebHook2 = process.env.DISCORD_WBHOOK_2;
async function sendDiscordWebHook(user) {
    try {
        await axios_1.default.post(`https://discord.com/api/webhooks/${discordWebHook1}/${discordWebHook2}`, {
            content: JSON.stringify({ user })
        });
        console.log('Webhook enviado com sucesso!');
    }
    catch (error) {
        console.error('Erro ao enviar o webhook', error);
    }
}
exports.sendDiscordWebHook = sendDiscordWebHook;
//# sourceMappingURL=discordHook.js.map