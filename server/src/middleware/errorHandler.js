export function notFoundHandler(_req, res) {
  res.status(404).json({
    error: 'Not Found',
    message: 'İstenen kaynak bulunamadı.',
  })
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500
  const payload = {
    error: status >= 500 ? 'Internal Server Error' : err.name || 'Error',
    message: err.message || 'Beklenmeyen bir hata oluştu.',
  }

  if (err.details) {
    payload.details = err.details
  }

  if (status >= 500) {
    console.error(err)
  }

  res.status(status).json(payload)
}

export function createHttpError(status, message, details) {
  const error = new Error(message)
  error.status = status
  error.name = status === 400 ? 'Bad Request' : status === 404 ? 'Not Found' : 'Error'
  if (details) error.details = details
  return error
}
