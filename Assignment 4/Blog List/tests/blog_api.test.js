const assert = require('node:assert')
const { test, after, beforeEach, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)
describe('when there is initially some blogs saved', () => {
	beforeEach(async () => {
		await Blog.deleteMany({})
		await Blog.insertMany(helper.initialBlogs)
	})

	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('all blogs are returned', async () => {
		const response = await api.get('/api/blogs')

		assert.strictEqual(response.body.length, helper.initialBlogs.length)
	})

	test('unique identifier property is named id', async () => {
		const blogsInDb = await Blog.find({})

		blogsInDb.forEach(blog => {
			const json = blog.toJSON()
			assert(json.id)
			assert.strictEqual(typeof json.id, 'string')
			assert.strictEqual(json._id, undefined)
		})
	})

	describe('cases when adding a blog', () => {
		test('a valid blog can be added', async () => {
			const newBlog = {
				title: "How about that",
				author: "hood",
				url: "yayer.com",
				likes: 10
			}

			await api
				.post('/api/blogs')
				.send(newBlog)
				.expect(201)
				.expect('Content-Type', /application\/json/)

			const blogsAtEnd = await helper.blogsInDb()  
			assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
			
			const contents = blogsAtEnd.map(n => n.title)  
			assert(contents.includes('How about that'))

		})

		test('likes default is 0', async () => {
			const noLikes = {
				title: "This has no likes",
				author: "liker",
				url: "nolikes.com",
			}

			await api
				.post('/api/blogs')
				.send(noLikes)
				.expect(201)
				.expect('Content-Type', /application\/json/)

			const blogsAtEnd = await helper.blogsInDb()
			const addedBlog = blogsAtEnd.find(b => b.title === 'This has no likes')

			assert(addedBlog)
			assert.strictEqual(addedBlog.likes, 0)  
		})

		test('blog without title or url returns 400 Bad Request', async () => {
			const noTitle = {
				author: "No titler",
				url: "notitles.com",
				likes: 10
			}

			const noUrl = {
				title: "No URL",
				author: "No URL",
				likes: 10
			}

			await api
				.post('/api/blogs')
				.send(noTitle)
				.expect(400)

			await api
				.post('/api/blogs')
				.send(noUrl)
				.expect(400)
		})
	})

	describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(n => n.title)
      assert(!titles.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })
})

after(async () => {
	await mongoose.connection.close()
})