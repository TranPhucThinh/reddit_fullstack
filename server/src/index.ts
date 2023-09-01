require('dotenv').config()
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { DataSource } from 'typeorm'

import { Post } from './entities/Post'
import { User } from './entities/User'
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/user'

const AppDataSource = new DataSource({
  type: 'postgres',
  database: 'reddit',
  username: process.env.DB_USERNAME_DEV,
  password: process.env.DB_PASSWORD_DEV,
  logging: true,
  synchronize: true,
  entities: [User, Post],
})

const app = express()

async function startServer() {
  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver],
    validate: false,
  })

  const apolloServer = new ApolloServer({
    schema,
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({
    app,
    cors: { origin: 'https://studio.apollographql.com', credentials: true },
  })

  const PORT = process.env.PORT || 4000
  app.listen(PORT, () =>
    console.log(
      `Server started on port ${PORT}. GraphQL server started on localhost:${PORT}${apolloServer.graphqlPath}`
    )
  )
}

startServer().catch((error) => console.log(error))

AppDataSource.initialize().catch((error) => console.log(error))
