import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [addMessage, setAddMessage] = useState(null)
  const [errorState, setErrorState] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
    }, [])
  
  const addNameNumber = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
  
    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      )
      if (!confirmUpdate) return
  
      const updatedPerson = { ...existingPerson, number: newNumber }
  
      personService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => 
            person.id === existingPerson.id ? returnedPerson : person
          ))
          setErrorState(false)
          setAddMessage(
            `Changed ${newName}`
          )
          setTimeout(() => {
            setAddMessage(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setErrorState(true)
          setAddMessage(
            `Information of ${existingPerson.name} has already been removed from server`
          )
          setTimeout(() => {
            setAddMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
  
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
  
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setErrorState(false)
          setAddMessage(`Added ${newName}`)
          setTimeout(() => setAddMessage(null), 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(error.response.data.error) // backend validation error message
          setErrorState(true)
          setAddMessage(error.response.data.error || 'An error occurred')
          setTimeout(() => setAddMessage(null), 5000)
        })
    }
  }
  

  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(nameFilter.toLowerCase())
  )

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    const confirmDelete = window.confirm(`Delete ${person.name}?`)
    if (!confirmDelete) return
  
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
  }
  
  
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNameFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addMessage} error={errorState} />
      <Filter value={nameFilter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addNameNumber}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} func = {handleDelete} />
    </div>
  )
}

export default App