import express from 'express'
import envs from './config/envs'

import graphQlServer from './server'

const port = envs.PORT

const app = express()
app.use(express.json())

graphQlServer(app, port)
    .catch((err) => {
        envs.ENV === 'production'
            ? console.log('SERVER ERROR', err.message ?? 'An Error occurred')
            : console.log('SERVER ERROR', err)
    })

export default app
