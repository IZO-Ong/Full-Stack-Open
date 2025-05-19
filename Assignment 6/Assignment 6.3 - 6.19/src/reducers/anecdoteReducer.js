import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      const newState = state.concat(action.payload)
      return [...newState].sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    updateAnecdote(state, action) {
      const updated = action.payload
      const newState = state.map(a =>
        a.id !== updated.id ? a : updated
      )
      return [...newState].sort((a, b) => b.votes - a.votes)
    }
  }
})

export const { appendAnecdote, setAnecdotes, updateAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    anecdotes.sort((a, b) => b.votes - a.votes)
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const returnedAnecdote = await anecdoteService.update(updatedAnecdote)
    dispatch(updateAnecdote(returnedAnecdote))
  }
}

export default anecdoteSlice.reducer
