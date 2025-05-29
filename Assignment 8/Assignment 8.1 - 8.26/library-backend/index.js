require('dotenv').config()
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { createServer } = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

const User = require('./models/User')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const MONGODB_URI = process.env.MONGODB_URI
console.log('🔌 Connecting to MongoDB...')
mongoose.set('strictQuery', false)

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message))

const start = async () => {
  const app = express()
  const httpServer = createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  const serverCleanup = useServer({
    schema,
    context: async (ctx) => {
      const auth = ctx.connectionParams?.authorization
      if (auth && auth.startsWith('Bearer ')) {
        try {
          const decoded = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decoded.id)
          return { currentUser }
        } catch (err) {
          console.error('❌ WebSocket auth error:', err.message)
        }
      }
      return {}
    }
  }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ]
  })

  await server.start()
  console.log("✅ express.json and cors setup complete")
  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization
        let currentUser = null

        if (auth && auth.startsWith('Bearer ')) {
          try {
            const decoded = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
            currentUser = await User.findById(decoded.id)
          } catch (err) {
            console.error('❌ JWT error:', err.message)
          }
        }

        return { currentUser }
      }
    })
  )

  const PORT = 4000
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
    console.log(`🔌 Subscriptions ready at ws://localhost:${PORT}/graphql`)
  })
}

start()
