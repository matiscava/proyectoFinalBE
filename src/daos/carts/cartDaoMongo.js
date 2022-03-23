import mongoose from 'mongoose';
const Schema = mongoose.Schema;


import MongoContainer from "./../../containers/MongoContainer.js";

class CartDaoMongo extends MongoContainer {
  constructor() {
    super('carts', {
      timestamp: {type: String, required: true},
      products: {type: Array, required:true},
      email: {type: String},
      adress: {type: String}
    })
  }
};

export default CartDaoMongo;