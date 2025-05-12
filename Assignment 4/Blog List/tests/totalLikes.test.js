const { test, describe } = require('node:test')
const assert = require('node:assert')
const totalLikes = require('../utils/list_helper').totalLikes

describe('totalLikes', () => {
  test('of empty list that is 0', () => {
    assert.strictEqual(totalLikes([]), 0)
  })

  test('of a list with one blog', () => {
    blog = {
        "title": "Yo mama",
        "author": "Mama",
        "url": "yomama.com",
        "likes": 10
    }
    assert.strictEqual(totalLikes([blog]), 10)
  })

  test('of a list with larger number of blogs', () => {
    blog1 = {
        "title": "Yo Dada",
        "author": "Daddy",
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
    assert.strictEqual(totalLikes([blog1, blog2, blog3]), 18)
  })
})