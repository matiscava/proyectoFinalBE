import logger from '../logger/index.js';
import path from 'path'

import Singleton from '../utils/Singleton.js';

const { daos } = Singleton.getInstance()
const { productsDao , usersDao , cartsDao } = daos

const getAll = async (req,res)=>{  
  const data = await productsDao.getAll();
  const idMongo = req.session && req.session.idMongo;
  const usuario = await usersDao.getById(idMongo);
  res.render(path.join(process.cwd(), '/views/pages/products.ejs'), {usuario: usuario, productsList: data})
}

const createProduct = async (req,res)=>{
  const objetoNuevo = req.body;
  const idMongo = req.session && req.session.idMongo;
  const usuario = await usersDao.getById(idMongo);
  
  if(usuario.admin){
      const productoNuevo = await productsDao.createProduct(objetoNuevo);
      logger.info(`Se ha creado un nuevo producto: ${productoNuevo}`);

      res.redirect('/api/products')

  }else{
      res.send({error: -1, descripcion: `ruta ${req.originalUrl} método ${req.method} no autorizado`});
  }
}

const deleteProduct = async (req,res)=>{
  const productID = req.params.id;
  const producto = await productsDao.getById(productID);
  const idMongo = req.session && req.session.idMongo;
  const usuario = await usersDao.getById(idMongo);

  if(producto===null){
      res.send({error: -3, descripcion: `el objeto ID ${productID} no existe ingrese otro ID`});
  } else if(usuario.admin){
      await productsDao.deleteById(productID);
      const productsList = await productsDao.getAll()
      res.redirect('/api/products')
      logger.warn({
            message: 'Se ha eliminado el producto',
            data: productsList
        })
  }else{
      res.send({error: -1, descripcion: `ruta ${req.originalUrl} método ${req.method} no autorizado`});
  }

} 

const getProduct = async (req,res)=>{   
  const findID = req.params.id;
  const findObjeto = await productsDao.getById(findID)
  const idMongo = req.session && req.session.idMongo;
  const usuario = await usersDao.getById(idMongo);
  if(findObjeto===null){
      res.send({error: -3, descripcion: `el objeto ID ${findID} no existe ingrese otro ID`});
  }else{
      res.render(path.join(process.cwd(), '/views/pages/productView.ejs'), {usuario: usuario, product: findObjeto})

  }
}

const addProductToCart = async (req,res) => {
  const findID = req.params.id;
  const idMongo = req.session && req.session.idMongo;
  let carritoID = req.session && req.session.carritoID;
  const product = await productsDao.getById(findID)
  const usuario = await usersDao.getById(idMongo);
  let cart;
  const productsList=[];
  const body = req.body;


  if(usuario && usuario.cart){
    carritoID = usuario.cart
    cart = await cartsDao.getById(usuario.cart);
  } else if(usuario && carritoID ){
    await cartsDao.addUserToCart(carritoID, usuario);
    await usersDao.addCartToUser(idMongo,carritoID);
    cart = await cartsDao.getById(carritoID);
  } else if(usuario){
    carritoID = await cartsDao.newCart()
    await usersDao.addCartToUser(idMongo,carritoID);
    cart = await cartsDao.getById(carritoID)
  }else if(!usuario && body.loggin){
    res.redirect('/api/users/login')
    return false;
  }else if(!usuario && !body.loggin){
    if(carritoID){
      cart = await cartsDao.getById(carritoID)
    }else{
      carritoID = await cartsDao.newCart()
      cart = await cartsDao.getById(carritoID)  
    }
  }
  let cantidadReq = parseInt(body.quantity);
  if( isNaN(cantidadReq) || cantidadReq === null) cantidadReq=1;
  productsList.push(...cart.products)
  const prodRepetido = await productsList.find(prod => prod.id === findID )
  const filtroIndex = await productsList.findIndex(prod => prod.id === findID );
  
  if(prodRepetido && filtroIndex >= 0){
    productsList[filtroIndex].quantity += cantidadReq;
    if (productsList[filtroIndex].quantity > productsList[filtroIndex].stock){
        productsList[filtroIndex].quantity = productsList[filtroIndex].stock
    }
  }else{

      let productoACargar = {...product,quantity:cantidadReq}
      productsList.push(productoACargar)
  }
  
  if (cart===undefined){
    res.send({error: -4, descripcion: `el carrito ID ${carritoID} no existe ingrese otro ID`});
  }else{
    await cartsDao.addProduct(carritoID,productsList);
  }
    
  const carritoActualizado = await cartsDao.getCart(carritoID);
  logger.info({
    message: 'Se ha modificado el carrito',
    data: carritoActualizado
  })
  req.session.carritoID = carritoID;
  res.redirect(`/api/carts/${carritoID}/products`)
}

const getEditProduct = async (req,res)=>{   
  const findID = req.params.id;
  const findObjeto = await productsDao.getById(findID)
  const idMongo = req.session && req.session.idMongo;
  const usuario = await usersDao.getById(idMongo);
  if(findObjeto===null){
      res.send({error: -3, descripcion: `el objeto ID ${findID} no existe ingrese otro ID`});
  }else{
      res.render(path.join(process.cwd(), '/views/pages/editProduct.ejs'), {usuario: usuario, product: findObjeto})

  }
}

const setProduct = async (req,res)=>{   

  const findID = req.params.id;
  const productoBody = req.body;
  const findObjeto = await productsDao.getById(findID)
  const idMongo = req.session && req.session.idMongo;
  const usuario = await usersDao.getById(idMongo);

  if(findObjeto===null){
      res.send({error: -3, descripcion: `el objeto ID ${findID} no existe ingrese otro ID`});
  }else if(usuario.admin){
      const productoModificado = await productsDao.update(findID,productoBody)
      res.redirect('/api/products')
      logger.warn({
        message: 'Se modifico el producto',
        data: productoModificado
      })
  }else{
      res.send({error: -1, descripcion: `ruta ${req.originalUrl} método ${req.method} no autorizado`});
  }
}

const getCategory = async (req,res) => {
  const category = req.params.category;
  const idMongo = req.session && req.session.idMongo;
  const productsList = await productsDao.getAll();
  const usuario = await usersDao.getById(idMongo);
  const categoryList = productsList.filter( (prod) => prod.category.toLowerCase().replace(/ /g, "") == category)


  res.render(path.join(process.cwd(), '/views/pages/products.ejs'), {usuario: usuario, productsList: categoryList})

}

export default {
  getAll,
  createProduct,
  deleteProduct,
  getProduct,
  setProduct,
  getEditProduct,
  getCategory,
  addProductToCart
}