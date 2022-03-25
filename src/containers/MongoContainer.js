import mongoose from 'mongoose';
import options from '../config.js';
import logger from './../logger/index.js';
import { asPOJO , renameField , removeField } from '../utils/objectsUtils.js';
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
class MongoContainer {
  constructor(collection, schema) {
    this.collection = mongoose.model(collection, schema);
    this.init();
  }
  
  async init() {
    try{
      if (!this.conexion) {
        this.conexion = await mongoose.connect(options.mongodb.cnxStr, options.mongodb.options);
      }
    }
    catch (err)
    {
      logger.error('Error:',err);
    }
  }
  
  async getAll() {
    try {
      let documents = await this.collection.find({},{__v:0}).lean();
      documents = documents.map(asPOJO);
      documents = documents.map( doc => renameField(doc, '_id' , 'id'))
      return documents;
    } catch (error) {
      logger.error('Error:', error);
    }
  }

  async getById(id) {
    try {
      const objID = new ObjectId(id)
      const documents = await this.collection.find({ '_id': objID },{__v:0})
      if (documents.length === 0) {
        return null;
      } else {
        const result = renameField(asPOJO(documents[0]), '_id', 'id')  
        return result;
      }
    } catch (error) {
      logger.error('Error:', error);
    }
  }

  async createProduct(producto) {
    try {
      console.log('createProduct', producto);
      const date = new Date().toLocaleString();
      let agregarData={...producto, timestamp:date}

      const document = await new this.collection(agregarData);
      const response = await document.save()

      logger.info('create new product: ', {response});
      return document._id; 
    } catch (error) {
      logger.error(error); throw error;
    }
  }

  async deleteById(id) {
    try {
      const response = await this.collection.deleteOne({ _id: id });
      logger.warn('deleteById: ', {response});
    }catch (error) {
      logger.error('Error:', error);
    };
  }

  async deleteAll() {
    try {
      await this.collection.deleteMany({});
      logger.warn('deleteAll: ');
    } catch (error) {
      logger.error('Error:', error);
    };
  }

  async update(id, element) {
    const date = new Date().toLocaleString();
    const newInfo = {...element,timestamp:date};
    
    const { n, nModified } = await this.collection.updateOne({ _id: id }, {
      $set: newInfo
    })
    if (n == 0 || nModified == 0) {
      logger.error(`Elemento con el id: '${id}' no fue encontrado`);
      return null;
    }

    const elementUpdated = await this.getById(id);

    return elementUpdated;
  }
  
  async newCart(){
    try{
        const date = new Date().toLocaleString();
        let carritoNuevo={ timestamp: date, products:[] };
        const document = await new this.collection(carritoNuevo);
        const response = await document.save()
        const result = renameField(asPOJO(document), '_id', 'id')  

        return result.id; 
    } catch (error) {
        logger.error('Error: ', error);
        throw error;
    }
  }

  async addCartToUser(userID,cartID) {
    try{
      const user = this.getById(userID);
      const date = new Date().toLocaleString();

      if(user.cart){
        return null;
      }else{
        const { n, nModified } = await this.collection.updateOne({ _id: userID }, {
          $set: {cart:cartID,timestamp:date}
        })
        if (n == 0 || nModified == 0) {
          logger.error(`Elemento con el id: '${id}' no fue encontrado`);
          return null;
        }

      }
    }catch(err){
      logger.error('Error: ', err);
      throw err;
    }
  }

  async addUserToCart(cartID,user){
    try{
      const date = new Date().toLocaleString();
      let { email: userEmail , adress: userAdress } = user;

      const { n, nModified } = await this.collection.updateOne({ _id: cartID }, {
        $set: {adress: userAdress, email: userEmail,timestamp:date}
      })
      if (n == 0 || nModified == 0) {
        logger.error(`Elemento con el id: '${id}' no fue encontrado`);
        return null;
      }
      console.log('Se agrego correctamete');
    }catch(err){
      logger.error('Error: ', err);
      throw err;
    }
  }

  async closeCart(userID,ticketID){
    try {
      const date = new Date().toLocaleString();
      
      await this.collection.updateOne({ _id: userID },{$set:{cart:'', timestamp: date}})
      await this.collection.updateOne({ _id: userID },{$addToSet :{'orders':ticketID}})
    } catch (error) {
      logger.error('Error: ', error);
      throw error;
    }
  }

  async addProduct(carritoId,product){
    try {
      const prod = product;
      const date = new Date().toLocaleString();
      const documents = await this.collection.updateOne({ _id: carritoId },{
        $set:{products:prod,timestamp: date}
      })
    } catch (error) {
      logger.error('Error: ', error);
      throw error;
    }
  }

  async getCart(carritoId){
    try{
      const documents = await this.collection.find({ _id: carritoId },{__v:0})
        return documents;
    } catch (error) {
        logger.error('Error: ', error);
        throw error;
    }
  }
  
  async emptyCart(carritoId){
    try{
      const date = new Date().toLocaleString();

      this.collection.updateOne({ _id: carritoId },{$set: {products:[]}});
      this.collection.updateOne({ _id: carritoId },{$set: {timestamp:date}});
    
    } catch (error) {
        logger.error('Error: ', error);
        throw error;
    }
  }

  async deleteItem(carritoId, productoId){
    try{
      const date = new Date().toLocaleString();
      const cart = await this.getCart(carritoId)
      const productsList = cart[0].products;
      const newProductList = productsList.find(prod => prod.id == productoId)
      const data = {timestamp:date,products: newProductList}
      console.log(data);
      await this.collection.updateOne({ _id: carritoId },{$pull: {products: newProductList}});
      await this.collection.updateOne({ _id: carritoId },{$set: {timestamp:date}});      
      return true

    } catch (error) {
        logger.error('Error: ', error);
        throw error;
    }
  }

  async createUser (user) {
    try{
      const userList = await this.getAll();

      //CORROBORANDO QUE NO SE REPITA EL USERNAME EN LA BASE DE DATOS
      let userRepeated = userList.find(usu => usu.username == user.username)
      if (userRepeated){
        logger.error(`El usuario ${user.username} ya está utilizado, ingrese otro username`)
        return false
      } 
      // CORROBORANDO QUE NO SE REPITA EL EMAIL EN LA BASE DE DATOS
      userRepeated = userList.find(usu => usu.email == user.email)
      if (userRepeated){
        logger.error(`El mail de contacto ${user.email} ya está utilizado, ingrese otro email`)
        return false
      } 
      const document = await this.collection(user);
      const response = await document.save()
      logger.info('Cliente creado', response);
      const result = renameField(asPOJO(document), '_id', 'id')  
      
      return result.id;
    }catch(err){
      logger.error('Error: ', err);
    }
  }

  async findUser (email) {
    try{
      const user = await this.collection.findOne({email: email}, {__v: 0});
      return user;
    }catch(err){logger.error(`Error: ${err}`)}
  }

  async previewTicket (cart,productsList){
    try{
      
      const cartProductsList = cart.products
      
      cartProductsList.forEach(prod => {
        let productRepeated = productsList.find( (produ) => produ.id === prod.id )
        if(prod.quantity > productRepeated.stock) {
          prod.quantity = productRepeated.stock;
        }
      })
      await this.addProduct(cart.id , cartProductsList)
      console.log(`Se ha modificado el carrito ${cart.id}`);
      const updatedCart =  await this.getById(cart.id)
      return updatedCart
    }catch(err){logger.error(`Error: ${err}`)}
  }
  

  async createTicket (ticketCompra) {
    try{
      const date = new Date().toLocaleString();
      let nextOrder = 1
      const orders = await this.getAll();
      if(orders.length!==0){
        for (let i=0;i<orders.length ;i++) {
            while( orders[i].orderNumber >= nextOrder ){
              nextOrder++;
            }
        }
      }
      const newTicket = {
        email:ticketCompra.email,
        orderNumber: nextOrder,
        timestamp: date,
        userId:ticketCompra.id,
        cart:ticketCompra.cart,
      }
      logger.info(newTicket);
      const document = await new this.collection(newTicket);
      const response = await document.save()
      logger.info('Ticket creado', response);
      const result = renameField(asPOJO(document), '_id', 'id')  

      return result.id;
    }catch(err){logger.error(`Error: ${err}`)}
  }

  async updateStock (cartProducts) {
    try{
      const productsList = await this.getAll();
      const newStock = []
      cartProducts.forEach(prod => {
        const productRepeated =  productsList.find( (product) => product.id === prod.id )    
        productRepeated.stock -= prod.quantity;
  
        if(productRepeated.stock < 0) productRepeated.stock=0;

        newStock.push({id: productRepeated.id, stock: productRepeated.stock})
        
      });

   for( let i = 0 ; i < newStock.length ; i++){
     const updatedProduct = await this.update(newStock[i].id , {stock: newStock[i].stock})
     console.log(`Se ha modificado el producto id: ${newStock[i].id}`);
    }
    }catch(err){logger.error(`Error: ${err}`)}
  }
}

export default MongoContainer;