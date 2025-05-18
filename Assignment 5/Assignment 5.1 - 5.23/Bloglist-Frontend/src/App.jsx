import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState('success')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => {
    return (
      <Togglable buttonLabel='login'>
        <LoginForm handleLogin={handleLogin} />
      </Togglable>
    )
  }

  const blogForm = () => {
    return (
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm handleCreate={addBlog} />
      </Togglable>
    )
  }

  const handleLike = async (blog) => {
    const userId = typeof blog.user === 'string'
      ? blog.user
      : blog.user?.id || blog.user?._id

    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: userId
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      const updatedBlogs = blogs
        .map(b => b.id !== blog.id ? b : returnedBlog)
        .sort((a, b) => b.likes - a.likes)

      setBlogs(updatedBlogs)
    } catch (error) {
      console.error('LIKE ERROR:', error.response?.data || error.message)
      setErrorType('error')
      setErrorMessage('Failed to update likes')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleDelete = async (blog) => {
    const confirmDelete = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
    if (!confirmDelete) return

    try {
      await blogService.remove(blog.id)
      const updatedBlogs = blogs
        .filter(b => b.id !== blog.id)
        .sort((a, b) => b.likes - a.likes)

      setBlogs(updatedBlogs)
      setErrorType('success')
      setErrorMessage(`Deleted blog "${blog.title}"`)
      setTimeout(() => setErrorMessage(null), 5000)
    } catch (error) {
      setErrorType('error')
      setErrorMessage('Failed to delete blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }


  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        blogFormRef.current.toggleVisibility()

        // Patch user field with full object to avoid PUT error later
        const fullUser = {
          username: user.username,
          name: user.name,
          id: user.id
        }

        const fullBlog = {
          ...returnedBlog,
          user: fullUser
        }

        setBlogs(blogs.concat(fullBlog))
        setErrorType('success')
        setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(() => {
        setErrorType('error')
        setErrorMessage('Failed to create blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setErrorType('failure')
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <Notification message={errorMessage} type={errorType} />}
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {errorMessage && <Notification message={errorMessage} type={errorType} />}
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </p>
      <h3>Create new blog</h3>
      {blogForm()}
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={() => handleLike(blog)}
          handleDelete={() => handleDelete(blog)}
          user={user}
        />
      )}
    </div>
  )
}

export default App
