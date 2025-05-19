import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient  } from '@tanstack/react-query'
import {getAnecdotes, updateAnecdote} from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {

  const queryClient = useQueryClient()
  
  const updateNoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const dispatch = useNotificationDispatch()

  const handleVote = (anecdote) => {
    updateNoteMutation.mutate({ content :anecdote.content, votes: anecdote.votes + 1, id: anecdote.id })
    dispatch({ type: 'SET', payload: `Anecdote '${anecdote.content}' voted` })
    setTimeout(() => {
      dispatch({ type: 'RESET' })
    }, 5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return (
      <div>
        <p> anecdote service not available due to problems in server </p>
      </div>
    )
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
