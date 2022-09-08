import envs from '../config/envs'
import Mailgun from 'mailgun.js'
import FormData from 'form-data'

export interface ISendMail {
  subject: string
  body: string
  to: string
}

export const sendEmail = async (recipients: string[], template: string, subject: string, template_vars: object) => {
    const mailgun = new Mailgun(FormData)
    const DOMAIN = envs.mailgun.domain
    const client = mailgun.client({ username: 'api', key: envs.mailgun.apiKey })

    const data = {
        from: envs.mailgun.from,
        to: recipients,
        subject,
        template,
        'h:X-Mailgun-Variables': JSON.stringify(template_vars),
        'o:require-tls': true,
        'o:skip-verification': false
    }

    try {
        await client.messages.create(DOMAIN, data)
        console.log('Email sent successfully')
    } catch (error) {
        console.log(error)
    }
}
