const Notification = ({ message, error }) => {
    if (message === null) {
      return null
    }
    if (!error) {
      return (
        <div className='message'>
          {message}
        </div>
      )
    } else {
      return (
        <div className='error'>
          {message}
        </div>
      )
    }
  }

export default Notification