"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendWelcomeEmail = async (to) => {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        auth: {
            user: "cadastroRPGv3@outlook.com",
            pass: "9d541529"
        }
    });
    const mailOptions = {
        from: 'cadastroRPGv3@outlook.com',
        to,
        subject: 'Bem-vindo(a) ao nosso site!',
        html: `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo(a) ao nosso site!</title>
      <style>
        /* Estilo para tornar a imagem uma marca d'água */
        body {
          background-image: url('https://imgbox.com/aMqBnx67');
          background-repeat: repeat-y;
          background-size: 100%;
        }
        /* Estilo para o conteúdo */
        .container {
          width: 90%;
          max-width: 700px;
          margin: 0 auto;
          background-color: rgba(255, 255, 255, 0.8);
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
          text-align: center;
          font-family: Arial, sans-serif;
        }
        h1 {
          font-size: 36px;
          margin-top: 50px;
          margin-bottom: 20px;
        }
        p {
          font-size: 18px;
          line-height: 24px;
          margin-bottom: 20px;
        }
        .logo {
          width: 150px;
          margin-bottom: 30px;
        }
        .button {
          background-color: #E84C3D;
          color: #FFF;
          border-radius: 5px;
          padding: 10px 20px;
          font-size: 16px;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Bem-vindo(a) ao nosso site!</h1>
        <img src="https://imgbox.com/aMqBnx67" alt="Logo" class="logo">
        <p>Olá,</p>
        <p>Seja bem-vindo(a) ao nosso site de RPG de mesa! Esperamos que você encontre aqui as melhores aventuras e faça muitos amigos!</p>
        <p>Estamos sempre atualizando o nosso conteúdo e adicionando novidades. Fique atento(a) às nossas notícias e novidades!</p>
        <p>Aproveite ao máximo a sua experiência em nosso site!</p>
        <a href="http://127.0.0.1:5500/index.html" class="button">Comece já a jogar!</a>
      </div>
    </body>
    </html>
`
    };
    await transporter.sendMail(mailOptions, function (err) {
        if (err) {
            console.error('Error sending email: ', err);
        }
        console.log('Email sent successfully!');
    });
};
exports.sendWelcomeEmail = sendWelcomeEmail;
//# sourceMappingURL=sendEmail.js.map