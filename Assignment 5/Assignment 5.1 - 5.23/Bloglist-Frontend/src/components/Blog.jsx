import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const isOwner = String(user?.username) === String(blog.user?.username)

  return (
    <div style={blogStyle} className='blog'>
      <div className="blog-summary">
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className="blog-details">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
            <div>{blog.user.name}</div>
            {isOwner && (
              <div>
                <button onClick={handleDelete}>delete</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog
