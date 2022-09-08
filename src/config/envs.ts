import { config } from 'dotenv'

config()

const envVars = process.env.NODE_ENV as 'development' | 'staging' | 'production'

export default {
    INTROSPECTION: true,
    ENV: envVars,
    MONGO_DB_URI: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/fidia-test',
    PORT: process.env.PORT || 4000,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'secret',
    mailgun: {
        apiKey: process.env.MAILGUN_API_KEY || 'key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        domain: process.env.MAILGUN_DOMAIN || 'sandboxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.mailgun.org',
        from: process.env.MAILGUN_FROM || 'Fidia <admin@fidia.com>'
    }
}
