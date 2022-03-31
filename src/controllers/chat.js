import path from 'path'

import Singleton from '../utils/Singleton.js';

const { daos } = Singleton.getInstance();
const { chatsDao , usersDao } = daos;

const getAll = async ( req , res ) => {
  const idMongo = req.session && req.session.idMongo;
  const usuario = await usersDao.getById(idMongo);

  res.render(path.join(process.cwd(), '/views/pages/chats.ejs'), {usuario: usuario})
  

}

const getMessagesByEmail = async ( req , res ) => {
  const email = req.params.email;
  const idMongo = req.session && req.session.idMongo;
  const usuario = await usersDao.getById(idMongo);

  const emailList = await chatsDao.getMessageByEmail(email)

  res.render(path.join(process.cwd(), '/views/pages/userChats.ejs'), {usuario: usuario,emailList: emailList})
}



export default {
  getAll,
  getMessagesByEmail
}