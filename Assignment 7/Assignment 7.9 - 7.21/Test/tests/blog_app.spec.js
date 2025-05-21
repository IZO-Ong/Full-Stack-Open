const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'sekret'
      }
    })

    await request.post('/api/users', {
      data: {
        name: 'Second User',
        username: 'seconduser',
        password: 'sekret2'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {

    await expect(page.getByRole('heading', { name: /log in to application/i })).toBeVisible()

    await page.getByRole('button', { name: 'login' }).click()
    
    const username = page.getByTestId('username')
    const password = page.getByTestId('password')

    await expect(username).toBeVisible()
    await expect(password).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'sekret')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrong')
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'sekret')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'A blog created by Playwright',
        author: 'Playwright Tester',
        url: 'https://example.com'
      })

      await expect(page.getByText('A blog created by Playwright Playwright Tester')).toBeVisible()
    })
    describe('and multiple blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: 'A blog created by Playwright',
          author: 'Playwright Tester',
          url: 'https://example.com'
        })
        await createBlog(page, {
          title: 'A blog created by Your Mom',
          author: 'Your Mama',
          url: 'https://yourmama.com'
        })
        await createBlog(page, {
          title: 'Disliked blog',
          author: 'A loner',
          url: 'https://solonely.com'
        })
      })
  
      test('like button increments the like count', async ({ page }) => {
        const blog = await page.getByText('A blog created by Playwright Playwright Tester')
        const blogElement = blog.locator('..')

        await blogElement.getByRole('button', { name: 'view' }).click()

        const likeDisplay = blogElement.getByText(/likes\s+\d+/i)  // Matches "likes 0", "likes 1", etc.

        await expect(likeDisplay).toHaveText(/likes\s+0/i)

        await blogElement.getByRole('button', { name: 'like' }).click()

        await expect(likeDisplay).toHaveText(/likes\s+1/i)
      })

      test('user who created blog can delete it', async ({ page }) => {
        const blog = await page.getByText('Disliked blog A loner')
        const blogElement = blog.locator('..')

        await blogElement.getByRole('button', { name: 'view' }).click()

        const deleteButton = blogElement.getByRole('button', { name: 'delete' })
        await expect(deleteButton).toBeVisible()

        page.once('dialog', async (dialog) => {
          expect(dialog.message()).toMatch(/remove blog/i)
          await dialog.accept()
        })

        await deleteButton.click()

        await expect(page.getByText('Disliked blog A loner')).not.toBeVisible()
      })

      test('only the user who added the blog sees the delete button', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'seconduser', 'sekret2')

        const blog = await page.getByText('A blog created by Playwright Playwright Tester')
        const blogElement = blog.locator('..')
        await blogElement.getByRole('button', { name: 'view' }).click()

        await expect(
          blogElement.getByRole('button', { name: 'delete' })
        ).not.toBeVisible()
      })

      test('blogs are in sorted order', async ({ page }) => {
        const blog1 = await page.getByText('Disliked blog A loner')
        const blog2 = await page.getByText('A blog created by Playwright Playwright Tester')

        const blogElement1 = blog1.locator('..')
        const blogElement2 = blog2.locator('..')

        await blogElement1.getByRole('button', { name: 'view' }).click()
        await blogElement2.getByRole('button', { name: 'view' }).click()

        const likeDisplay1 = blogElement1.getByText(/likes\s+\d+/i)
        const likeDisplay2 = blogElement2.getByText(/likes\s+\d+/i)

        await blogElement1.getByRole('button', { name: 'like' }).click()
        await expect(likeDisplay1).toHaveText(/likes\s+1/i)

        await blogElement1.getByRole('button', { name: 'like' }).click()
        await expect(likeDisplay1).toHaveText(/likes\s+2/i)

        await blogElement2.getByRole('button', { name: 'like' }).click()
        await expect(likeDisplay2).toHaveText(/likes\s+1/i)

        const blogs = await page.locator('.blog').all()

        const titles = await Promise.all(
          blogs.map(async blog => {
            const summary = await blog.locator('.blog-summary').textContent()
            return summary.replace(/view|hide/, '').trim()
          })
        )

        // Assert the expected order
        expect(titles).toEqual([
          'Disliked blog A loner',
          'A blog created by Playwright Playwright Tester',
          'A blog created by Your Mom Your Mama'
        ])
      })
    })
  })
})