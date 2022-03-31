import env from './env.js'
import app from './server.js'
import logger from './logger/index.js'
import { Server as HttpServer } from 'http';
import { Server as IOServer , Socket } from 'socket.io';


import Singleton from './utils/Singleton.js';
import { apiSession } from './server.js';

const { daos } = Singleton.getInstance();
const { usersDao , chatsDao } = daos;



const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

io.use((socket, next) => {
    apiSession(socket.request, socket.request.res || {} , next)
} )


io.on('connection', async (socket) =>{
    
    const idMongo = socket.request && socket.request.session.idMongo;
    const usuario = await usersDao.getById(idMongo);
    if(usuario){
        console.log('Se ha conectado un nuevo Usuario');
        const messages = await chatsDao.getAll();
        socket.emit('messages', messages);

        socket.on('new-message', async (data) => {
            await chatsDao.sendMessage(data);
            const messages = await chatsDao.getAll();

            io.sockets.emit('messages', messages)
        })
    }else{
        console.log('No está logueado');
    }

})

const PORT = parseInt( process.env.PORT) || 8080;

const server = httpServer.listen(PORT, () => {
    logger.info(`Servidor http escuchando en el puerto http://localhost:${server.address().port}`)
})
server.on('error', error => logger.error(`Error en servidor ${error}`))




