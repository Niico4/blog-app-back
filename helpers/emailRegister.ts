import nodemailer from 'nodemailer';

interface Props {
  email: string;
  name: string;
  token: string;
}

const emailRegister = async ({ name, email, token }: Props) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_REGISTRO_HOST,
    port: Number(process.env.EMAIL_REGISTRO_PORT),
    auth: {
      user: process.env.EMAIL_REGISTRO_USER,
      pass: process.env.EMAIL_REGISTRO_PASSWORD,
    },
  });

  const html = `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Confirmación de Cuenta</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          background-color: #a604f2;
          padding: 20px;
          color: #fff;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          margin: 10px 0;
        }
        .cta-button {
          display: inline-block;
          margin-top: 20px;
          padding: 15px 25px;
          background-color: #a604f2;
          color: #fff;
          text-decoration: none;
          font-weight: bold;
          border-radius: 5px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          text-align: center;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Confirmación de Cuenta</h1>
        </div>
        <div class="content">
          <p>Hola, <strong>${name}</strong>!</p>
          <p>Gracias por registrarte. Para completar tu registro y activar tu cuenta, por favor haz clic en el siguiente botón:</p>
          <a href="${process.env.FRONTEND_URL}/auth/confirm-account/${token}" class="cta-button">
            Confirmar Cuenta
          </a>
          <p>Si no solicitaste esta cuenta, simplemente ignora este correo.</p>
        </div>
      </div>
    </body>
  </html>
`;

  const info = await transport.sendMail({
    from: 'Blog Web | Creative Code',
    to: email,
    subject: 'Confirmación de Cuenta en Creative Code',
    html,
  });

  console.log('Mensaje enviado: %s', info.messageId);
};

export default emailRegister;
