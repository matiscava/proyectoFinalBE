import express from 'express';
const TicketRouter = express.Router();

import ticketController from '../controllers/ticket.js';

TicketRouter.get('/:id', ticketController.getById )

export default TicketRouter;