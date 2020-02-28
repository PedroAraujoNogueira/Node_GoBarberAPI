// SMTP é um protocolo para envio de emaisl.

export default {
  host: 'smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: '273859f34f3844',
    pass: 'b1f162287793da',
  },
  default: {
    from: 'Aprendizado <pedroaraujonogueirati@gmail.com>',
  },

};

// Serviçoes de email pago.
// 1) Amazon SES. (usado pela rocketseat)
// 2) mailgun
// 3) sparkpost e etc

// Para testes podemos usar o mailtrap, funciona somente em ambiente de desenvolvimento.
