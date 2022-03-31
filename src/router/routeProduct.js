import express from 'express';
const productsRouter = express.Router();

import productController from '../controllers/product.js'

//MUESTRA LA LISTA DE PRODUCTOS

productsRouter.get('/', productController.getAll );

//CARGA UN PRODUCTO NUEVO

productsRouter.post('/', productController.createProduct)

//BORRA EL PRODUCTO SELECCIONADO

productsRouter.delete('/eliminar/:id', productController.deleteProduct)

//MUESTRA UN PRODUCTO ESPECIFICO

productsRouter.get('/:id', productController.getProduct );
productsRouter.post('/:id', productController.addProductToCart );

//MUESTRA UN PRODUCTO ESPECIFICO

productsRouter.get('/category/:category', productController.getCategory );

//MODIFICA UN PRODUCTO ESPECIFICO

productsRouter.put('/editar/:id', productController.setProduct );
productsRouter.get('/editar/:id', productController.getEditProduct );


export default productsRouter;