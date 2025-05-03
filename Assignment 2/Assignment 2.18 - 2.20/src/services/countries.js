import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getByName = (name) => {
    const url = `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
    return axios.get(url).then(response => response.data)
  }

export default { 
  getAll
}