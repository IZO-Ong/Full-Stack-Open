const Notification = ({ message, type }) => {
  if (!message) return null

  const isSuccess = type === 'success'

  const notificationStyle = {
    color: isSuccess ? 'green' : 'red',
    background: isSuccess ? '#dfd' : '#fdd',
    fontSize: 16,
    border: `1px solid ${isSuccess ? 'green' : 'red'}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={notificationStyle} className="error">
      {message}
    </div>
  )
}

export default Notification