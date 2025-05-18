import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

let blog
let user

beforeEach(() => {
  blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://example.com',
    likes: 0,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  user = {
    username: 'testuser',
    name: 'Test User'
  }
})

test('renders title and author, but not url or likes by default', () => {
  const mockHandler = vi.fn()

  const { container } = render(
    <Blog
      blog={blog}
      user={user}
      handleLike={mockHandler}
      handleDelete={mockHandler}
    />
  )

  const summary = container.querySelector('.blog-summary')
  const details = container.querySelector('.blog-details')

  expect(summary).toHaveTextContent('Test Blog Title')
  expect(summary).toHaveTextContent('Test Author')
  expect(details).toBeNull()
})

test('shows blog url and likes after clicking the view button', async () => {
  const mockHandler = vi.fn()

  render(
    <Blog
      blog={{ ...blog, likes: 5 }}
      user={user}
      handleLike={mockHandler}
      handleDelete={mockHandler}
    />
  )

  const userSim = userEvent.setup()
  const viewButton = screen.getByText('view')
  await userSim.click(viewButton)

  expect(screen.getByText('https://example.com')).toBeInTheDocument()
  expect(screen.getByText('likes 5')).toBeInTheDocument()
})

test('calls event handler twice when like button is clicked twice', async () => {
  const mockLikeHandler = vi.fn()
  const mockDeleteHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      user={user}
      handleLike={mockLikeHandler}
      handleDelete={mockDeleteHandler}
    />
  )

  const userSim = userEvent.setup()

  const viewButton = screen.getByText('view')
  await userSim.click(viewButton)

  const likeButton = screen.getByText('like')
  await userSim.click(likeButton)
  await userSim.click(likeButton)

  expect(mockLikeHandler.mock.calls).toHaveLength(2)
})


test('calls event handler with correct blog data when form is submitted', async () => {
  const mockCreateHandler = vi.fn()

  render(<BlogForm handleCreate={mockCreateHandler} />)

  const user = userEvent.setup()

  const titleInput = screen.getByRole('textbox', { name: /title/i })
  const authorInput = screen.getByRole('textbox', { name: /author/i })
  const urlInput = screen.getByRole('textbox', { name: /url/i })
  const createButton = screen.getByRole('button', { name: /create/i })

  await user.type(titleInput, 'Test Blog Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'https://example.com')
  await user.click(createButton)

  expect(mockCreateHandler.mock.calls).toHaveLength(1)
  expect(mockCreateHandler.mock.calls[0][0]).toEqual({
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://example.com'
  })
})

