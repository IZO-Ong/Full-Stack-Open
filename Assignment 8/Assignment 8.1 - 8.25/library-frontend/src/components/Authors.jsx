import { useState } from 'react'
import Select from 'react-select'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const Authors = (props) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [bornYear, setBornYear] = useState('')

  const [changeAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    awaitRefetchQueries: true,
  })

  if (!props.show) return null

  const authors = props.authors || []

  const options = authors.map((a) => ({
    value: a.name,
    label: a.name
  }))

  const submit = async (event) => {
    event.preventDefault()
    if (!selectedOption) return

    try {
      await changeAuthor({
        variables: {
          name: selectedOption.value,
          setBornTo: Number(bornYear),
        }
      })
      setSelectedOption(null)
      setBornYear('')
    } catch (e) {
      console.error("Submission error:", e)
    }
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born || ''}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <Select
            value={selectedOption}
            onChange={setSelectedOption}
            options={options}
            placeholder="Select author..."
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={bornYear}
            onChange={({ target }) => setBornYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
