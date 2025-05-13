const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })

  await user.save()
})

describe('user creation', () => {
  test('fails if username is shorter than 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name: 'Shortie',
      password: 'validpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error || result.body.message)
    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 1) // only root remains
  })

  test('fails if password is shorter than 3 characters', async () => {
    const newUser = {
      username: 'validuser',
      name: 'TinyPass',
      password: 'pw'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error || result.body.message)
    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('succeeds with valid and unique user', async () => {
    const newUser = {
      username: 'johndoe',
      name: 'John Doe',
      password: 'securepass'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 2)
    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes('johndoe'))
  })
})