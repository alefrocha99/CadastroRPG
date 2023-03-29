"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDiscordWebHook = void 0;
const axios_1 = __importDefault(require("axios"));
async function sendDiscordWebHook(user) {
    try {
        await axios_1.default.post('https://discord.com/api/webhooks/1089742476832682004/rTM3hpkn-5aGfzGsyDAe1DskjId3yog53MiB-Bc6xLm3ae5MiOUaD8wCoWetDYTxpxPe', {
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