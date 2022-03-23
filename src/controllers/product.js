import logger from '../logger/index.js';
import path from 'path'

import Singleton from '../utils/Singleton.js';

const { daos } = Singleton.getInstance()
const { productsDao , usersDao } = daos

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
      res.render(path.join(process.cwd(), '/views/pages/editProduct.ejs'), {usuario: usuario, product: findObjeto})

  }
}

const setProduct = async (req,res)=>{   

  const findID = req.params.id;
  const productoBody = req.body;
  console.log('setProduct', productoBody);
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

export default {
  getAll,
  createProduct,
  deleteProduct,
  getProduct,
  setProduct
}