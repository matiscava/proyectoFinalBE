import express from 'express';
const chatRouter = express.Router();

import chatController from '../controllers/chat.js';

//MUESTRA LA TODOS LOS CHATS

chatRouter.get('/', chatController.getAll );


//MOSTRAR LOS MENSAJES DEL USUARIO

chatRouter.get('/:email', chatController.getMessagesByEmail );


export default chatRouter;