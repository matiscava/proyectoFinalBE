import mongoose from 'mongoose';
const Schema = mongoose.Schema;


import MongoContainer from "../../containers/MongoContainer.js";

class ProductDaoMongo extends MongoContainer {
  constructor() {
    super('products', {
      title: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
      photo: { type: String, required: true },
      category: { type: String, required: true },
      timestamp: {type: String, required: true}
    })
  }
};

export default ProductDaoMongo;