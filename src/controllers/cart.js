import logger from '../logger/index.js';
import path from 'path'

import { cartTicketMailOptions , transporter } from '../utils/nodemailerSettings.js';
import { sendMessage } from '../utils/twilioSettings.js'

import Singleton from '../utils/Singleton.js';

const { daos } = Singleton.getInstance()

const { productsDao , usersDao , cartsDao , ticketsDao} = daos;


const getAll = async (req,res)=>{   
  const idMongo = req.session && req.session.idMongo;
  const carritoID = req.session && req.session.carritoID;
  const usuario = await usersDao.getById(idMongo);
  const listaCarritos = await cartsDao.getAll();
  const carrito = await cartsDao.getCart(carritoID)
  res.render(path.join(process.cwd(), '/views/pages/carts.ejs'), {usuario: usuario, carrito: carrito, listaCarritos})
}

const createCart = async (req,res)=>{
    const idMongo = req.session && req.session.idMongo;
    const usuario = await usersDao.getById(idMongo);
    let carritoID
    if (usuario && usuario.cart) {
        res.redirect(`carts/${usuario.cart}/products`)
    }else{
        carritoID = await cartsDao.newCart();
        logger.info({message: `Carrito creado con el ID ${carritoID}`})
        req.session.carritoID = carritoID;
        
    }
    if(usuario){
        await cartsDao.addUserToCart(carritoID, usuario);
        await usersDao.addCartToUser(idMongo,carritoID);
    }
    res.redirect(`carts/${carritoID}/products`)
}

const addProductToCart = async (req,res) => {
  const carritoID = req.params.id;
  const error = []
  const productoReq = req.body;
  const carritoElegido = await cartsDao.getById(carritoID);
  const producto = await productsDao.getById(productoReq.id)
  const productsList = []
  let cantidadReq = parseInt(productoReq.quantity)
  if( isNaN(cantidadReq) || cantidadReq === null) cantidadReq=1;
  productsList.push(...carritoElegido.products)
    // INICIO DE ACTUALIZACION DE CANTIDAD A LA LISTA DE PRODUCTOS, SI EL PRODUCTO ES REPETIDO
  const prodRepetido = await productsList.find(prod => prod.id === producto.id )
  const filtroIndex = await productsList.findIndex(prod => prod.id === producto.id);
  
  
  if(prodRepetido && filtroIndex >= 0){
      productsList[filtroIndex].quantity += cantidadReq;
      if (productsList[filtroIndex].quantity > productsList[filtroIndex].stock){
          productsList[filtroIndex].quantity = productsList[filtroIndex].stock
      }
  }else{

      let productoACargar = {...producto,quantity:cantidadReq}
      productsList.push(productoACargar)
  }
    //FINAL DE ACTUALIZACION DE CANTIDAD
  if (carritoElegido===undefined){
      res.send({error: -4, descripcion: `el carrito ID ${carritoID} no existe ingrese otro ID`});
  }else{
      await cartsDao.addProduct(carritoID,productsList);
  }
      
    const carritoActualizado = await cartsDao.getCart(carritoID);
  if(error.length!==0){
      logger.info({
          message: 'Se ha modificado el carrito',
          data: carritoActualizado,
          error: error
      })
  }else{
      logger.info({
          message: 'Se ha modificado el carrito',
          data: carritoActualizado
      })
  }
  res.redirect(`/api/carts/${carritoID}/products`)
  }

const getCartProducts = async (req,res) => {
    try{
        const carritoID = req.params.id;
        const carritoElegido = await cartsDao.getById(carritoID);
        const productList = await productsDao.getAll();
        const idMongo = req.session && req.session.idMongo;
        const usuario = await usersDao.getById(idMongo);

        let precioFinal = 0;
        
        carritoElegido.products.forEach( (producto) => {
            let subTotal = producto.quantity * producto.price
            precioFinal += subTotal;
        });
      
        if (carritoElegido===undefined){
            res.send({error: -4, descripcion: `el carrito ID ${carritoID} no existe ingrese otro ID`});
        }else{
            res.render(path.join(process.cwd(), '/views/pages/cartView.ejs'), {usuario, cart: carritoElegido, cartID: carritoID, productsList: productList, precioFinal})
      
        }
    }catch(err){console.error('error:',err);}
}

const removeCart = async (req,res) => {
  const carritoID = req.params.id;
  const carritoElegido = await cartsDao.getCart(carritoID);
  if (carritoElegido===undefined){
      res.send({error: -4, descripcion: `el carrito ID ${carritoID} no existe ingrese otro ID`});
  }else{
      await cartsDao.emptyCart(carritoID);
      res.send({message: `Se ha vaciado el carrito ID ${carritoID}`})
  }
}

const removeCartProduct = async (req,res) => {
  const carritoID = req.params.id;
  const productoID = req.params.id_prod;
  const producto = await productsDao.getById(productoID);
  const carritoElegido = await cartsDao.getCart(carritoID);
  if(producto===null){
      res.send({error: -3, descripcion: `el producto ID ${productoID} no existe ingrese otro ID`});
  }else if (carritoElegido===undefined){
      res.send({error: -4, descripcion: `el carrito ID ${carritoID} no existe ingrese otro ID`});
  }else{
      const eliminado =  await cartsDao.deleteItem(carritoID, productoID);
      if(eliminado){
          res.redirect(`/api/carts/${carritoID}/products`)
          logger.warn({message: `Se ha eliminado el producto ID ${productoID} del carrito ID ${carritoID}`})
      }else{
          res.send({error: -3, descripcion: `el producto ID ${productoID} no existe en el carrito ID ${carritoID}`});
      }
  }
}

const mekeTicket = async ( req , res ) => {
  const carritoID = req.params.id;
  const carritoElegido = await cartsDao.getById(carritoID);
  const idMongo = req.session && req.session.idMongo;
  const usuario = await usersDao.getById(idMongo);

  let precioFinal = 0;
  carritoElegido.products.forEach( (producto) => {
      let subTotal = producto.quantity * producto.price
      precioFinal += subTotal;
  });
  //ACTUALIZACION DE STOCK
  await productsDao.updateStock(carritoElegido.products)

  const cartList = {cart: carritoElegido}
  
  let ticketCompra = {...usuario,...cartList};
  let htmlItems = '';
  const ticketId = await ticketsDao.createTicket(ticketCompra)

  for (const product of ticketCompra.cart.products) {
      let cadenaString = `   <div class="cartItemsTexts">
      <p>${product.title}</p>
      <p>Cantidad: ${product.quantity}</p>
      <p>Valor por unidad: $${product.price}</p>
      <p>Subtotal: $${product.price * product.quantity}</p>
    </div>`;
    htmlItems+=cadenaString;
  }

  const html = `<h2>Felicitaciones ${usuario.username}, ha finalizado su compra</h2>
  <p>El número de referencia es ${ticketId}</p>
  ${htmlItems}
  <p class="cartValorTotal">Total: $${precioFinal}</p>
  `
  const cuerpoWhatsapp = {
      body: `Felicitaciones ${usuario.username}, ha finalizado su compra.El número de referencia es ${ticketId}`,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:+${usuario.phone}`
  }
  sendMessage(cuerpoWhatsapp)
  transporter.sendMail(cartTicketMailOptions(usuario.photo , usuario.email , html), ( err , info ) => {
      if(err) {
        logger.error(err);
        return err
      }
      logger.info(info);
    })
  await cartsDao.deleteById(carritoID)
  await usersDao.closeCart(idMongo,ticketId)

  res.render(path.join(process.cwd(), '/views/pages/cartBuy.ejs'), { cartTicket: ticketCompra, ticketId: ticketId, precioFinal})

}

export default {
    getAll,
    addProductToCart,
    createCart,
    getCartProducts,
    removeCart,
    removeCartProduct,
    mekeTicket
}
