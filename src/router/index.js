import express from 'express';

const indexRouter = express.Router();

import cartRoute from './routeCart.js';
import productsRoute from './routeProduct.js';
import usersRoute from './routeUser.js';
import chatRoute from './routeChat.js';
import TicketRoute from './routeTicket.js';


indexRouter.use('/products', productsRoute);
indexRouter.use( '/carts', cartRoute);
indexRouter.use( '/users' , usersRoute);
indexRouter.use('/chat', chatRoute);
indexRouter.use('/order', TicketRoute);


export default indexRouter;