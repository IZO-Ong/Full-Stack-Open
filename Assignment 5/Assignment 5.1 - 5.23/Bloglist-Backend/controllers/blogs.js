const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'userId missing or not valid' })  
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    console.error('Error deleting blog:', error.message)
    response.status(500).json({ error: 'something went wrong while deleting the blog' })
  }
})


blogsRouter.put('/:id', async (request, response) => {
  let { title, author, url, likes, user } = request.body

  if (typeof user === 'object' && user !== null) {
    user = user.id || user._id
  }

  const isValidObjectId = String(user).match(/^[a-fA-F0-9]{24}$/)
  if (!isValidObjectId) {
    return response.status(400).json({ error: 'malformatted id' })
  }

  const updatedBlog = { title, author, url, likes, user }

  try {
    const result = await Blog.findByIdAndUpdate(
      request.params.id,
      updatedBlog,
      { new: true }
    ).populate('user', { username: 1, name: 1 })

    response.status(200).json(result)
  } catch (error) {
    console.error('PUT error:', error.message)
    response.status(500).json({ error: 'something went wrong while updating the blog' })
  }
})


module.exports = blogsRouter