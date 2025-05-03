import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import countryService from './services/countries'
import Display from './components/Display'

const App = () => {
  const [countries, setCountries] = useState([])
  const [countryFilter, setCountryFilter] = useState('')

  useEffect(() => {
    countryService.getAll().then(data => {
      setCountries(data)
    })
  }, [])

  const countriesToShow = countries.filter(country => 
    country.name.common.toLowerCase().includes(countryFilter.toLowerCase())
  )

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setCountryFilter(event.target.value)
  }

  return (
    <div>
      <Filter value={countryFilter} onChange={handleFilterChange} />
      <Display countries={countriesToShow}/>
    </div>
  )
}

export default App