import Details from './Details'
import { useState } from 'react'

const Display = ({ countries }) => {
    const [shownCountries, setShownCountries] = useState([])
    if (countries.length === 0) {
      return <p>No matches found.</p>
    }
    if (countries.length === 1) {
      const country = countries[0]
      return <Details country={country}/>
    }
    if (countries.length > 10) {
      return <p>Too many matches, specify another filter.</p>
    }

    const toggleShow = (cca3) => {
        setShownCountries(prev =>
          prev.includes(cca3)
            ? prev.filter(code => code !== cca3)
            : [...prev, cca3]
        )
      }
    
      return (
        <div>
          {countries.map(country => (
            <div key={country.cca3}>
              <p>
                {country.name.common}{' '}
                <button onClick={() => toggleShow(country.cca3)}>
                  {shownCountries.includes(country.cca3) ? 'Hide' : 'Show'}
                </button>
              </p>
              {shownCountries.includes(country.cca3) && (
                <Details country={country} />
              )}
            </div>
          ))}
        </div>
      )
    }
  export default Display