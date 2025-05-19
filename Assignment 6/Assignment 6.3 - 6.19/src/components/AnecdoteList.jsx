import { useDispatch, useSelector } from 'react-redux'
import {voteAnecdote} from '../reducers/anecdoteReducer'
import {showNotification} from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state =>
    state.anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
    )
  )

  const handleIncrementVote = async (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(showNotification(`You voted: '${anecdote.content}'`, 5))
}

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleIncrementVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList