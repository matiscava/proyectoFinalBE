import logger from '../logger/index.js';
import path from 'path'

import Singleton from '../utils/Singleton.js';

const { daos } = Singleton.getInstance()
const { ticketsDao , usersDao } = daos;


const getById = async ( req , res) => {
  const idMongo = req.session && req.session.idMongo;
  const usuario = await usersDao.getById(idMongo);
  const orderID = req.params.id;
  const order = await ticketsDao.getById(orderID);
  let precioFinal = 0;
  console.log('getByidorder',order);

if(order===null){
    res.send({error: -3, descripcion: `La orden ID ${orderID} no existe ingrese otro ID`});
}else if(usuario){
  order.cart.products.forEach( (producto) => {
    let subTotal = producto.quantity * producto.price
    precioFinal += subTotal;
  });
  res.render(path.join(process.cwd(), '/views/pages/ticketView.ejs'), { cartTicket: order, ticketId: orderID, precioFinal})
}else{
    res.send({error: -1, descripcion: `ruta ${req.originalUrl} método ${req.method} no autorizado`});
}


}

export default {
  getById
}
