import mongoose from 'mongoose';
const Schema = mongoose.Schema;


import MongoContainer from "../../containers/MongoContainer.js";

class ChatDaoMongo extends MongoContainer {
  constructor() {
    super('chats', {
      timestamp: {type: String, required: true},
      email: {type: String, required:true},
      message: {type: String, required:true}
    })
  }
};

export default ChatDaoMongo;