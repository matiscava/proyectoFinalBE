import path from 'path';
import logger from '../logger/index.js' 
import options from '../config.js';

import { newUserMailOptions , transporter } from '../utils/nodemailerSettings.js';
import { createHash , isValidPassword } from '../utils/bCryptSetting.js';

import Singleton from '../utils/Singleton.js';
import { renameField } from '../utils/objectsUtils.js';

const { daos } = Singleton.getInstance()
const { usersDao , ticketsDao } = daos;

const loginUser = async ( req , res ) => {
  if (req.isAuthenticated()) {
      res.redirect('/')
  }else{

      const idMongo = req.session && req.session.idMongo;
      if(idMongo !== undefined){
        const usuario = await usersDao.getById(idMongo);
        if (usuario) {
            res.redirect('/api/products')
        } 
      } else {
        res.render(path.join(process.cwd(), '/views/pages/login.ejs'))
    }


  }
}

const postLoginUser = async ( req , res ) => {
  const { username , password } = req.body;
  const user = await usersDao.findUser(username);

  req.session.idMongo = user.id;

  res.redirect('/api/products');
}

const failLoginUser = (req , res) => {
  res.render(path.join(process.cwd(), '/views/pages/faillogin.ejs'))
}

const logoutUser = async ( req , res ) => {
  const idMongo = req.session && req.session.idMongo;
  const usuario = await usersDao.getById(idMongo);

  if (usuario) {
      req.session.destroy(error => {
          if (!error) {
              res.render(path.join(process.cwd(), '/views/pages/logout.ejs'), { nombre: usuario.username})
          } else {
              res.redirect('/')
          }
      })
  } else {
      res.redirect('/')
  }
}

const signupUser = ( req , res ) => {
  res.render(path.join(process.cwd(), '/views/pages/signup.ejs'))
}

const postSingupUser = async ( req , res ) => {
  const user = req.user;
  if ( user) res.redirect('/')
  else {
      let problema = 'user error signup';
      res.render(path.join(process.cwd(), '/views/pages/error.ejs'),{problema: problema, link: '/signup'})
  }
}

const failSingupUser = (req , res) => {
  res.render(path.join(process.cwd(), '/views/pages/failsignup.ejs'))
}

const infoUser = async ( req , res ) => {
  const idMongo = req.session && req.session.idMongo;
  const usuario = await usersDao.getById(idMongo);

  if (!usuario) {
    res.redirect('/api/users/login')
  }else{
    let orders = []

    for(let i = 0 ; i < usuario.orders.length; i++){
      const userOrder = await ticketsDao.getById(usuario.orders[i])
      orders.push(userOrder)

    }
    res.render(path.join(process.cwd(), '/views/pages/info.ejs'),{usuario,orders})
  }

}

//PASSPORT FUNCTIONS

const loginPassportUser =   async (username , password , done ) => {
  let user = await usersDao.findUser(username);
  
  if (!user) {
      logger.info('User Not Found with username ',username);
      return done ( null , false )
  } 
  
  if ( !isValidPassword( user , password ) ) {
      logger.info( 'Invalid Password' );
      return done ( null , false )
  }
  //configuramos el usuario para que sea legible en todas las persistencias
  if (user._id){
    user = JSON.parse(JSON.stringify(user))
    user.id = user._id;
    delete user._id;
  } 

  return done ( null , user.id )
  
}

const signupPassportUser =   async (req , username , email , done ) => {
  const user = await usersDao.findUser(username);
  let photo = '';
  if (user) {
      logger.info('User already exists');
      return done( null , false )
  } 
  logger.info('prueba passport',req.body);
  if( req.body.photo === '') {
    photo = 'https://static.diariosur.es/www/pre2017/multimedia/RC/201501/12/media/cortadas/avatar--320x378.jpg'
  }else{
    photo = req.body.photo
  }
  const newUser = {
      username: req.body.username,
      password: createHash(req.body.password),
      email: req.body.email,
      name: req.body.name,
      lastname: req.body.lastname,
      phone: req.body.phone,
      adress: req.body.adress,
      photo: photo,
      cart: ""
  }

  const idUser = await usersDao.createUser(newUser)
  logger.info('User register succesful iD ',idUser);
  req.session.idMongo = idUser;
  transporter.sendMail(newUserMailOptions(req.body.username , photo), ( err , info ) => {
    if(err) {
      logger.error(err);
      return err
    }
    logger.info(info);
  })
  return done( null , idUser)
}

const getHome = async (req,res)=>{   
  const idMongo = req.session && req.session.idMongo;
  const carritoID = req.session && req.session.carritoID;
  const usuario = await usersDao.getById(idMongo);

  if (!usuario){
    res.render(path.join(process.cwd(), '/views/pages/home.ejs'), {usuario: null , carritoID: carritoID})
  }else{  
      res.redirect('/api/products')
  }
}

const serverInfoUser = async (req,res) => {
  const idMongo = req.session && req.session.idMongo;
  const usuario = await usersDao.getById(idMongo);
  const carritoID = req.session && req.session.carritoID;
  if (!usuario){
    res.redirect('/api/products')
  }else{  
    res.render(path.join(process.cwd(), '/views/pages/serverInfo.ejs'), {usuario: usuario , carritoID: carritoID, server: options})
  }

}

export default {
  loginUser,
  postLoginUser,
  failLoginUser,
  logoutUser,
  signupUser,
  postSingupUser,
  failSingupUser,
  infoUser,
  loginPassportUser,
  signupPassportUser,
  getHome,
  serverInfoUser
}