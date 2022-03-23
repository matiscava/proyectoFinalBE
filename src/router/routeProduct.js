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

//MODIFICA UN PRODUCTO ESPECIFICO

productsRouter.put('/:id', productController.setProduct );

export default productsRouter;