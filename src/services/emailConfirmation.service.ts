import nodemailer from 'nodemailer';

interface Props {
  email: string;
  name: string;
  token: string;
}

const sendAccountConfirmationEmail = async ({ name, email, token }: Props) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST,
    port: Number(process.env.EMAIL_SERVICE_PORT),
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASSWORD,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirmación de Cuenta</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f8f9fa;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
      }
      .email-header {
        background: #3b0a45;
        color: #ffffff;
        padding: 40px;
        text-align: center;
      }
      .email-header h1 {
        margin: 0;
        font-size: 36px;
        font-weight: bold;
      }
      .email-content {
        padding: 30px;
        text-align: center;
      }
      .email-content .subtitle {
        font-size: 28px;
        font-weight: semi-bold;
        color: #5a2a7f;
        margin: 20px 0;
      }
      .email-content p {
        font-size: 18px;
        color: #333;
        line-height: 1.6;
        margin: 15px 0;
      }
      .btn-container {
        display: flex;
        justify-content: center;
        margin: 30px 0;
      }
      .btn-container a {
        text-decoration: none;
      }
      button {
        background-image: linear-gradient(
          270deg,
          rgba(59, 10, 69, 1) 0%,
          rgba(62, 16, 84, 1) 100%
        );
        border: 0;
        border-radius: 8px;
        box-shadow: rgba(151, 65, 252, 0.4) 0 15px 30px -5px;
        color: #ffffff;
        font-size: 18px;
        font-weight: bold;
        padding: 15px 30px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
      }
      button:hover {
        background-image: linear-gradient(
          270deg,
          rgba(62, 16, 84, 1) 0%,
          rgba(59, 10, 69, 1) 100%
        );
        box-shadow: rgba(151, 65, 252, 0.6) 0 20px 40px -5px;
      }
      button:active {
        transform: scale(0.95);
        box-shadow: rgba(151, 65, 252, 0.8) 0 10px 20px -5px;
      }
      .email-footer {
        background: #3b0a45;
        color: #ffffff;
        padding: 20px;
        text-align: center;
        font-size: 14px;
      }
      .email-footer p {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>¡Hola, ${name}!</h1>
      </div>
      <div class="email-content">
        <p class="subtitle">¡Tu cuenta está casi lista!</p>
        <p>
          Para completar tu registro y comenzar a disfrutar de todas las
          funciones, haz clic en el botón a continuación:
        </p>
        <div class="btn-container">
          <a href="${process.env.FRONTEND_BASE_URL}/auth/confirm-account/${token}">
            <button>Confirmar Cuenta</button>
          </a>
        </div>
        <p>Si no solicitaste esta cuenta, simplemente ignora este correo.</p>
      </div>
      <div class="email-footer">
        <p>Gracias por unirte a nosotros.</p>
      </div>
    </div>
  </body>
</html>
`;

  try {
    const info = await transport.sendMail({
      from: 'BlinkBytes | Blog web',
      to: email,
      subject: 'Confirma tu cuenta',
      html,
    });

    console.log('Mensaje enviado: %s', info.messageId);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('No se pudo enviar el correo de confirmación de cuenta');
  }
};

export default sendAccountConfirmationEmail;
