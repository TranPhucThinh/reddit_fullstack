require('dotenv').config()
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import MongoStore from 'connect-mongo'
import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { DataSource } from 'typeorm'

import { COOKIE_NAME, __prod__ } from './constants'
import { Post } from './entities/Post'
import { User } from './entities/User'
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/user'
import { Context } from './types/Context'
import { PostResolver } from './resolvers/post'

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
    resolvers: [HelloResolver, UserResolver, PostResolver],
    validate: false,
  })

  // Session/Cookie store
  const mongoUrl = `mongodb+srv://${process.env.SESSION_DB_USERNAME_DEV_PROD}:${process.env.SESSION_DB_PASSWORD_DEV_PROD}@cluster0.zuzasdc.mongodb.net/?retryWrites=true&w=majority`
  await mongoose.connect(mongoUrl)

  console.log('MongoDB connected')

  //Session connection
  app.use(
    session({
      name: COOKIE_NAME,
      store: MongoStore.create({ mongoUrl }),
      cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true, // js fe cannot access cookie
        secure: __prod__, // cookie only work at https
        sameSite: 'lax', // protection against CSRF
      },
      secret: process.env.SESSION_SECRET_DEV_PROD as string,
      saveUninitialized: false,
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): Context => ({ req, res }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        // options
      }),
    ],
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
