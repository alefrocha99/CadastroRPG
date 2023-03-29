"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: 'seu-email@outlook.com',
        pass: 'sua-senha',
    },
});
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'seu-email@outlook.com',
        to,
        subject,
        text,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`E-mail enviado para ${to}: ${info.response}`);
    }
    catch (error) {
        console.error(`Erro ao enviar e-mail para ${to}: ${error}`);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=mailer.js.map