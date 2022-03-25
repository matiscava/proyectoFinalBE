import express from 'express';
const cartRouter = express.Router();

import cartController from './../controllers/cart.js';


//MUESTRA LA LISTA DE PRODUCTOS

cartRouter.get('/', cartController.getAll );

//CREA UN CARRITO NUEVO

cartRouter.post('/', cartController.createCart )


//AGREGA LOS PRODUCTOS AL CARRITO INGRESANDO UN ARRAY CON LOS ID Y LA QUANTITY DE CADA UNO

cartRouter.post('/:id/products', cartController.addProductToCart )

//MUESTRA LOS PRODUCTOS DEL CARRITO

cartRouter.get('/:id/products', cartController.getCartProducts )

//BORRA EL CARRITO

cartRouter.delete('/:id', cartController.removeCart )

//BORRA UN PRODUCTO DEL CARRITO

cartRouter.delete('/:id/products/:id_prod', cartController.removeCartProduct )

//FINALIZAR LA COMPRA

cartRouter.get( '/:id/products/confirm-buy', cartController.previewTicket )

cartRouter.get( '/:id/products/finish-buy', cartController.mekeTicket )


export default cartRouter;