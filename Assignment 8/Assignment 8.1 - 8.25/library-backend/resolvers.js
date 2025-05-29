const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),

    allBooks: async (root, args) => {
      const filter = {}
      if (args.genre) filter.genres = args.genre
      const books = await Book.find(filter).populate('author')
      return args.author
        ? books.filter(b => b.author.name === args.author)
        : books
    },

    allAuthors: async () => {
      const authors = await Author.find({})
      const books = await Book.find({})
      const countMap = books.reduce((acc, b) => {
        const id = b.author.toString()
        acc[id] = (acc[id] || 0) + 1
        return acc
      }, {})
      return authors.map(a => ({
        ...a.toObject(),
        bookCount: countMap[a._id.toString()] || 0
      }))
    },

    me: (root, args, context) => context.currentUser
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new Error('not authenticated')
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({ ...args, author: author._id })
      await book.save()
      const populated = await book.populate('author')

      pubsub.publish('BOOK_ADDED', { bookAdded: populated })
      console.log('🚀 Published BOOK_ADDED event for', populated.title)

      return populated
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) throw new Error('not authenticated')
      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      author.born = args.setBornTo
      return await author.save()
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user.save()
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new Error('wrong credentials')
      }
      const userForToken = { username: user.username, id: user._id }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers