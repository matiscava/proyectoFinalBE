import env from './env.js'
import app from './server.js'
import logger from './logger/index.js'

const PORT = parseInt( process.env.PORT) || 8080;

const server = app.listen(PORT, () => {
    logger.info(`Servidor http escuchando en el puerto http://localhost:${server.address().port}`)
})
server.on('error', error => logger.error(`Error en servidor ${error}`))



