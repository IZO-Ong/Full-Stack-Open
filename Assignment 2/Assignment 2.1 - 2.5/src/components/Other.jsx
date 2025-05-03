const Course = ({ course }) => {
  console.log("Course received:", course)
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
    </div>
  )
}

const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => {
  const total = props.parts.reduce((x, part) => x + part.exercises, 0)
  
  return (
    <div>
      {props.parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
      <Total
        total={total}
      />
    </div>
  )
}
  

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <p><b> total of {props.total} exercises </b></p>

export default Course;