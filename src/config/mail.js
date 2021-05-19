export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Cassio Tessaro <noreply@gobarber.com>'
  }
}

// Para produção vou usar o
// Amazon SES < Vou usar esse
// Mailgun
// Sparkpost
// Mandril(Mailchimp)


// Para desenvolvimento vou usar o
// Mailtrap (DEV)
// mailtrap.io <SITE
