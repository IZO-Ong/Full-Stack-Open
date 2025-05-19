import {createAnecdote} from '../requests'
import {useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {

  const dispatch = useNotificationDispatch()

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SET', payload: `You created anecdote '${newAnecdote.content}'` })
      setTimeout(() => dispatch({ type: 'RESET' }), 5000)
    },
    onError: (error) => {
      dispatch({ type: 'SET', payload: 'Too short anecdote, must have length 5 or more' })
      setTimeout(() => dispatch({ type: 'RESET' }), 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
