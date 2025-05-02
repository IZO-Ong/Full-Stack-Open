import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad

  if (total === 0) {
    return <p>No feedback given</p>
  }

  const average = (good - bad) / total
  const positive = (good / total * 100) + '%'

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGoodByOne = () => {
    console.log('increasing good, value before', good)
    setGood(good + 1)
  }

  const increaseNeutralByOne = () => {
    console.log('increasing neutral, value before', neutral)
    setNeutral(neutral + 1)
  }

  const increaseBadByOne = () => {
    console.log('increasing bad, value before', bad)
    setBad(bad + 1)
  }
  
  const total = good + neutral + bad

  return (
    <div>
      <h1> give feedback </h1>

      <Button onClick={increaseGoodByOne} text="good" />
      <Button onClick={increaseNeutralByOne} text="neutral" />
      <Button onClick={increaseBadByOne} text="bad" />
      
      <h1> statistics </h1>

      <Statistics good = {good} neutral = {neutral} bad = {bad} />
    </div>
  )
} 

export default App