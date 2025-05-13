const Blog = require('../models/blog')

const initialBlogs = [
    {
        "title": "Yo Dada",
        "author": "Mama",
        "url": "yodada.com",
        "likes": 5
    },
    {
        "title": "Yo mama",
        "author": "Mama",
        "url": "yomama.com",
        "likes": 6
    },
    {
        "title": "Yo bro",
        "author": "Brother",
        "url": "brother.com",
        "likes": 7
    }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}