import mongoose from 'mongoose';
const Schema = mongoose.Schema;


import MongoContainer from "../../containers/MongoContainer.js";

class UserDaoMongo extends MongoContainer {
  constructor() {
    super('users', {
        username: {type: String, required:true},
        name: {type: String, required:true},
        lastname: {type: String, required:true},
        email: {type: String, required:true},
        password: {type: String, required:true},
        adress: {type: String, required:true},
        photo: { type: String, default: "https://static.diariosur.es/www/pre2017/multimedia/RC/201501/12/media/cortadas/avatar--320x378.jpg" },
        phone: { type: String, required: true },
        admin: {type: Boolean, default: false},
        cart: {type: String},
        orders: {type: Array, default: [], required: true}
      })
  }
};

export default UserDaoMongo;