import ProductDaoFile from './products/productDaoFile.js';
import CartDaoFile from './carts/cartDaoFile.js';
import UserDaoFile from './users/userDaoFile.js';
import TicketsDaoFile from './tickets/ticketDaoFile.js';
import ChatDaoFile from './chats/chatDaoFile.js';

import ProductDaoMongo from './products/productDaoMongo.js';
import CartDaoMongo from './carts/cartDaoMongo.js';
import UserDaoMongo from './users/userDaoMongo.js';
import TicketsDaoMongo from './tickets/ticketDaoMongo.js';
import ChatDaoMongo from './chats/chatDaoMongo.js';

import ProductDaoMemory from './products/productDaoMemory.js';
import CartDaoMemory from './carts/cartDaoMemory.js';
import UserDaoMemory from './users/userDaoMemory.js';
import TicketsDaoMemory from './tickets/ticketDaoMemory.js';
import ChatDaoMemory from './chats/chatDaoMemory.js';

class PersistenceFactory {
  constructor(pers){
    this.daos = {}
    this.getPersistenceMethod(pers)
  }
  async getPersistenceMethod(pers) {
    if(pers){
      
      if(pers ==='json'){
        this.daos['productsDao'] = new ProductDaoFile;
        this.daos['cartsDao'] = new CartDaoFile;
        this.daos['usersDao'] = new UserDaoFile;
        this.daos['ticketsDao'] = new TicketsDaoFile;
        this.daos['chatsDao'] = new ChatDaoFile;
        console.log('se conecto a json');
      }
  
      if(pers ==='mongodb'){
        this.daos['productsDao'] = new ProductDaoMongo();
        this.daos['cartsDao'] = new CartDaoMongo();
        this.daos['usersDao'] = new UserDaoMongo();
        this.daos['ticketsDao'] = new TicketsDaoMongo();
        this.daos['chatsDao'] = new ChatDaoMongo();
        console.log('se conecto a mongodb');

      }

      if (pers =='memory'){
        this.daos['productsDao'] = new ProductDaoMemory;
        this.daos['cartsDao'] = new CartDaoMemory;
        this.daos['usersDao'] = new UserDaoMemory;
        this.daos['ticketsDao'] = new TicketsDaoMemory;    
        this.daos['chatsDao'] = new ChatDaoMemory;    
        console.log('se conecto a memory');
  
      }

    } else if (!pers){
      this.daos['productsDao'] = new ProductDaoMemory;
      this.daos['cartsDao'] = new CartDaoMemory;
      this.daos['usersDao'] = new UserDaoMemory;
      this.daos['ticketsDao'] = new TicketsDaoMemory;    
      this.daos['chatsDao'] = new ChatDaoMemory;    
      console.log('se conecto a memory');

    }

  }

}

export default PersistenceFactory
