const Persons = ({ persons, func }) => (
  <div>
    {persons.map(person => (
      <div key={person.name}>
        <p>
          {person.name}: {person.number}
          <button onClick={() => func(person.id)}>delete</button>
        </p>
      </div>
    ))}
  </div>
)

export default Persons