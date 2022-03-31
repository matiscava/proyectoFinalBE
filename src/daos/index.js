import ProductDaoFile from './products/ProductDaoFile.js';
import CartDaoFile from './carts/CartDaoFile.js';
import UserDaoFile from './users/UserDaoFile.js';
import TicketsDaoFile from './tickets/TicketDaoFile.js';
import ChatDaoFile from './chats/chatDaoFile.js';

import ProductDaoMongo from './products/ProductDaoMongo.js';
import CartDaoMongo from './carts/CartDaoMongo.js';
import UserDaoMongo from './users/UserDaoMongo.js';
import TicketsDaoMongo from './tickets/TicketDaoMongo.js';
import ChatDaoMongo from './chats/chatDaoMongo.js';

import ProductDaoMemory from './products/ProductDaoMemory.js';
import CartDaoMemory from './carts/CartDaoMemory.js';
import UserDaoMemory from './users/UserDaoMemory.js';
import TicketsDaoMemory from './tickets/TicketDaoMemory.js';
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
