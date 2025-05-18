import { useState } from 'react'

const BlogForm = ({ handleCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    handleCreate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
  <form onSubmit={addBlog}>
    <div>
      <label htmlFor="title">title:</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
      />
    </div>
    <div>
      <label htmlFor="author">author:</label>
      <input
        id="author"
        type="text"
        value={author}
        onChange={({ target }) => setAuthor(target.value)}
      />
    </div>
    <div>
      <label htmlFor="url">url:</label>
      <input
        id="url"
        type="text"
        value={url}
        onChange={({ target }) => setUrl(target.value)}
      />
    </div>
    <button type="submit">create</button>
  </form>
  )
}

export default BlogForm
