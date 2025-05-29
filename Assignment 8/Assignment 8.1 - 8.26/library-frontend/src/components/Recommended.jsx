const Recommended = ({ books, user, show }) => {
  if (!show || !user) return null

  const genre = user.favoriteGenre
  const filteredBooks = books.filter(b => b.genres.includes(genre))

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{genre}</strong></p>

      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
