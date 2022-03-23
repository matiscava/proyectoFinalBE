import mongoose from 'mongoose';
const Schema = mongoose.Schema;


import MongoContainer from "../../containers/MongoContainer.js";

class TicketDaoMongo extends MongoContainer {
  constructor() {
    super('tickets', {
      email: {type: String, required: true},
      orderNumber: {type: Number, required: true},
      timestamp: {type: String, required: true},
      userId:{type: String, required: true},
      cart: {type: Array, required:true}
    })
  }
};

export default TicketDaoMongo;