import express from 'express';

const indexRouter = express.Router();

import cartRoute from './routeCart.js';
import productsRoute from './routeProduct.js';
import usersRoute from './routeUser.js';

indexRouter.use('/products', productsRoute);
indexRouter.use( '/carts', cartRoute);
indexRouter.use( '/users' , usersRoute);

export default indexRouter;