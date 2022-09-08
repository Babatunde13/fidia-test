import 'reflect-metadata'
import { GraphQLError } from 'graphql'
import { ApolloServer } from 'apollo-server-express'
import { Application } from 'express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import depthLimit from 'graphql-depth-limit'
import { buildSchema } from 'type-graphql'
import http from 'http'

import { connectToDB } from './config/connect_to_db'
import resolvers from './graphql/resolvers/index'
import routes from './api/routes/'
import envs from './config/envs'

export default async function graphQlServer (app: Application, PORT: string | number) {
    // Connect to DB
    await connectToDB()
    // Express Rest Apis
    routes(app)

    // Graphql Server
    const schema = await buildSchema({
        resolvers,
        emitSchemaFile: false,
        validate: false,
        dateScalarMode: 'isoDate',
    })

    const httpServer = http.createServer(app)

    const apolloServer = new ApolloServer({
        schema,
        introspection: true,
        context: ({ req, res }) => ({ req, res }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        validationRules: [depthLimit(10)],
        formatError: (error: GraphQLError): any => {
            if (error?.extensions?.code === 'INTERNAL_SERVER_ERROR') {
                    error.message = 'Something went wrong'
            }

            return envs.ENV === 'production' ? error.message : error
        }
    })

    await apolloServer.start()
    apolloServer.applyMiddleware({ app, path: '/api/graphql' })

    httpServer.listen(PORT, () => {
        console.log(`Server is Listening on Port ${PORT}`)
    })
}
