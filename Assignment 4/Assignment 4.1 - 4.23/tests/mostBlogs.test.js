const { test, describe } = require('node:test')
const assert = require('node:assert')
const mostBlogs = require('../utils/list_helper').mostBlogs

describe('mostBlogs', () => {
  test('of empty list that is 0', () => {
    assert.deepStrictEqual(mostBlogs([]), null)
  })

  test('of a list with one blog', () => {
    blog = {
        "title": "Yo mama",
        "author": "Mama",
        "url": "yomama.com",
        "likes": 10
    }
    assert.deepStrictEqual(mostBlogs([blog]), {author: "Mama", blogs: 1})
  })

  test('of a list with larger number of blogs', () => {
    blog1 = {
        "title": "Yo Dada",
        "author": "Mama",
        "url": "yodada.com",
        "likes": 5
    }
    blog2 = {
        "title": "Yo mama",
        "author": "Mama",
        "url": "yomama.com",
        "likes": 6
    }
    blog3 = {
        "title": "Yo bro",
        "author": "Brother",
        "url": "brother.com",
        "likes": 7
    }
    assert.deepStrictEqual(mostBlogs([blog1, blog2, blog3]), {author: "Mama", blogs: 2})
  })
})