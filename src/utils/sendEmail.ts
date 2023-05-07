import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

const outlookPort = process.env.OUTLOOK_PORT;
const outlookUser = process.env.OUTLOOK_USER
const outlookPassword = process.env.OUTLOOK_PASSWORD

export const sendWelcomeEmail = async (to: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtps.uhserver.com",
    port: outlookPort,
    auth: {
      user: `${outlookUser}`,
      pass: `${outlookPassword}`
    },
    tls: {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2"
  }
  
  });

  const mailOptions = {
    from: `${outlookUser}`,
    to,
    subject: 'Bem-vindo(a) ao QuestLog Brasil!',
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
        <a href="http://www.questlogbrasil.xyz/" class="button">Comece já a jogar!</a>
      </div>
    </body>
    </html>
`
  };


    await transporter.sendMail(mailOptions, function(err){
      if(err){
        console.error('Error sending email: ', err)
      } console.log('Email sent successfully!');
    });
  }

