require('dotenv').config()
const mongoose = require('mongoose')
const Author = require('./models/Author')
const Book = require('./models/Book')
const Book = require('./models/Book')

mongoose.set('strictQuery', false)

const MONGODB_URI = process.env.MONGODB_URI

const authors = [
  { name: 'Robert Martin', born: 1952 },
  { name: 'Martin Fowler', born: 1963 },
  { name: 'Fyodor Dostoevsky', born: 1821 },
  { name: 'Joshua Kerievsky' },
  { name: 'Sandi Metz' },
]

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'revolution']
  },
]

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB, seeding data...')

    await Author.deleteMany({})
    await Book.deleteMany({})

    const authorMap = {}
    for (const a of authors) {
      const newAuthor = new Author(a)
      await newAuthor.save()
      authorMap[a.name] = newAuthor._id
    }

    for (const b of books) {
      const book = new Book({
        title: b.title,
        published: b.published,
        genres: b.genres,
        author: authorMap[b.author]
      })
      await book.save()
    }

    console.log('Seeding complete!')
    mongoose.connection.close()
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message)
    mongoose.connection.close()
  })
