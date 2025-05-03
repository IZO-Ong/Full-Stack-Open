import { useEffect, useState } from 'react'
import axios from 'axios'

const Details = ({country}) => {
    const [weather, setWeather] = useState(null)
    const api_key = import.meta.env.VITE_WEATHER_KEY.trim().replace(/^"|"$/g, '')
    useEffect(() => {
        const capital = country.capital[0]
        const lat = country.capitalInfo?.latlng?.[0]
        const lon = country.capitalInfo?.latlng?.[1]
    
        if (!lat || !lon) return
        axios
          .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
          .then(response => {
            setWeather(response.data)
          })
          .catch(err => console.error("Failed to get Weather:", err))
      }, [country, api_key])

    
    return (
        <div>
            <h1> {country.name.common} </h1>
            <p>
                Capital: {country.capital[0]}<br />
                Area: {country.area}
            </p>
            <h2> Languages </h2>
            <ul>
                {Object.values(country.languages).map((language, index) => (
                    <li key={index}>{language}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="200" />
            {weather && (
                <div>
                    <h1>Weather in {country.capital[0]}</h1>
                    <p>Temperature: {weather.main.temp}°C</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                    />
                    <p>Wind: {weather.wind.speed} m/s</p>
                </div>
            )}
        </div>
        )
}

export default Details