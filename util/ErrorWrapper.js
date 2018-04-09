class ErrorWrapper extends Error {
  constructor (message, status) {
    super()
    this.stack = new Error().stack
    this.message = message
    this.status = status || 500
  }
}

module.exports = ErrorWrapper