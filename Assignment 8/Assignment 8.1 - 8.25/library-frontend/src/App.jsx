import { useEffect, useState } from "react"
import { useLazyQuery, useQuery, useApolloClient, useSubscription } from '@apollo/client'

import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'

import { ALL_AUTHORS, ALL_BOOKS, ME, BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const client = useApolloClient()

  const [loadAuthors, { data: authorData }] = useLazyQuery(ALL_AUTHORS)
  const { data: bookData, refetch: refetchBooks } = useQuery(ALL_BOOKS, {
    skip: page !== 'books' && page !== 'recommended',
    variables: { genre: null },
  })

  const { data: userData } = useQuery(ME, {
    skip: !token,
  })

  const user = userData?.me

  useEffect(() => {
    if (page === "authors") {
      loadAuthors()
    }
  }, [page, loadAuthors])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data?.data?.bookAdded
      if (!addedBook) return

      alert(`📚 New book added: ${addedBook.title} by ${addedBook.author.name}`)

      client.refetchQueries({
        include: ['allBooks'],
      })
    }
  })


  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage("authors")
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommended")}>recommended</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Notify errorMessage={errorMessage} />

      {page === "authors" && <Authors show={true} authors={authorData?.allAuthors} />}
      {page === "books" && <Books show={true} books={bookData?.allBooks} />}
      {page === "add" && token && <NewBook show={true} setError={notify} />}
      {page === "recommended" && token && user && (
        <Recommended show={true} books={bookData?.allBooks || []} user={user} />
      )}
      {page === "login" && !token && (
        <LoginForm
          setToken={(token) => {
            setToken(token)
            setPage("authors")
          }}
          setError={notify}
        />
      )}
    </div>
  )
}

export default App
