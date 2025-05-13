const ld = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCounts = ld.countBy(blogs, 'author')

  const topAuthor = ld.maxBy(Object.keys(authorCounts), (author) => authorCounts[author])

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesByAuthor = ld(blogs)
    .groupBy('author')
    .map((posts, author) => ({
      author,
      likes: ld.sumBy(posts, 'likes')
    }))
    .maxBy('likes')

  return likesByAuthor
}

module.exports = {
  dummy,
  totalLikes,
  mostBlogs,
  mostLikes
}