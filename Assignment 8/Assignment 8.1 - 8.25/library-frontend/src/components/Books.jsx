import { useLazyQuery, useQuery } from '@apollo/client'
import { useState, useRef, useEffect } from 'react'
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries'

const Books = ({ show, bookAdded }) => {
  const { data: allData } = useQuery(ALL_BOOKS)
  const [getBooksByGenre, { data: genreData, refetch }] = useLazyQuery(BOOKS_BY_GENRE)
  const [selectedGenre, setSelectedGenre] = useState(null)

  const lastSelectedGenreRef = useRef(null)
  const allBooks = allData?.allBooks || []
  const books = selectedGenre ? genreData?.allBooks || [] : allBooks

  const genres = Array.from(new Set(allBooks.flatMap(b => b.genres)))

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre)
    lastSelectedGenreRef.current = genre

    if (genre === null) return
    getBooksByGenre({ variables: { genre } })
  }

  // 👇 When a new book is added, re-fetch the current genre
  useEffect(() => {
    if (bookAdded && selectedGenre && refetch) {
      refetch({ genre: lastSelectedGenreRef.current })
    }
  }, [bookAdded])

  if (!show) return null

  return (
    <div>
      <h2>books</h2>
      {selectedGenre && <p>in genre <strong>{selectedGenre}</strong></p>}

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginBottom: '1rem' }}>
        {genres.map((genre) => (
          <button key={genre} onClick={() => handleGenreClick(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => handleGenreClick(null)}>all genres</button>
      </div>
      
    </div>
  )
}

export default Books
