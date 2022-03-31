import fs from 'fs';
import logger from './../logger/index.js';
import crypto from 'crypto';


export default class FileContainer {
    constructor ( archivo ) {
        this.archivo = `${process.cwd()}${archivo}`;
    }
    async getAll () {
        try{
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const objeto = JSON.parse(data);
            return objeto;
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }
    async getById (idNum) {
        try{
            const objeto = await this.getAll()
            const objetoFiltrado = objeto.filter(obj => obj.id === idNum);
            if (objetoFiltrado[0]===undefined) {
                return null;
            }else{
                return objetoFiltrado[0];
            }        
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }
    async createProduct(objetoNuevo){
        try{
            const objeto = await this.getAll();
            const date = new Date().toLocaleString();
            const id = crypto.randomBytes(10).toString('hex');
            let agregarData= {...objetoNuevo, id: id, timestamp: date}

            objeto.push(agregarData);
            const dataToJSON = JSON.stringify(objeto,null,2);
            fs.writeFileSync(`${this.archivo}` , dataToJSON);
            return id;
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async deleteById(idNum){
        try{
            const objeto = await this.getAll();
            const objetoFiltrado = objeto.filter(obj => obj.id !== idNum);
            const dataToJSON = JSON.stringify(objetoFiltrado,null,2);
            fs.writeFileSync(`${this.archivo}` , dataToJSON);
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async update(id,elemento){
        try{
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const lista = JSON.parse(data);
            const elementoGuardado = lista.find((obj)=> obj.id === id)
            const elementoIndex = lista.findIndex((obj)=> obj.id === id)
            if (!elementoGuardado){
                logger.error(`El elemento con el id: ${id}, no existe`);
                return null;
            }
            const elementoSubido= {
                ...elementoGuardado,
                ...elemento
            }
            lista.splice(elementoIndex,1,elementoSubido)
            const dataToJSON = await JSON.stringify(lista,null,2);
            fs.writeFileSync(`${this.archivo}` , dataToJSON);

            return elementoSubido;
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async newCart(){
        try{
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const objeto = JSON.parse(data);
            const id = crypto.randomBytes(10).toString('hex');
            const date = new Date().toLocaleString();

            let carritoNuevo={id: id, timestamp: date, products:[] }

            objeto.push(carritoNuevo);
            const dataToJSON = JSON.stringify(objeto,null,2);
            fs.writeFileSync(`${this.archivo}` , dataToJSON);
            return id;
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async addCartToUser(userID,cartID){
        try{
            const user = await this.getById(userID);
            const date = new Date().toLocaleString();
            
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const lista = JSON.parse(data);
           
            const elementoIndex = lista.findIndex((obj)=> obj.id === userID)
           
            if(user.cart){
                return null
            } else{
                user.cart = cartID
            }
            lista.splice(elementoIndex,1,user)
            const dataToJSON = await JSON.stringify(lista,null,2);
            fs.writeFileSync(`${this.archivo}` , dataToJSON);

        }catch(err){
            logger.error('Error: ', err);
            throw err;
        }
    }

    async addUserToCart(cartID,user){
        try{
            const date = new Date().toLocaleString();
            let { email: userEmail , adress: userAdress } = user;

            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const lista = JSON.parse(data);

            const elemento = {adress: userAdress, email: userEmail,timestamp:date}
            
            const elementoGuardado = lista.find((obj)=> obj.id === cartID)
            const elementoIndex = lista.findIndex((obj)=> obj.id === cartID)
            if (!elementoGuardado){
                logger.error(`El elemento con el id: ${id}, no existe`);
                return null;
            }
            const elementoSubido= {
                ...elementoGuardado,
                ...elemento
            }
            lista.splice(elementoIndex,1,elementoSubido)
            const dataToJSON = await JSON.stringify(lista,null,2);
            fs.writeFileSync(`${this.archivo}` , dataToJSON);
    
        }catch(err){
            logger.error('Error: ', err);
            throw err;
        }
    }

    async closeCart(userID,ticketID){
        try {
            const date = new Date().toLocaleString();
            const user = await this.getById(userID);
            user.cart = ''
            user.orders.push(ticketID)
            user.timestamp = date;

            const userList = await this.getAll();
            const userIndex = userList.findIndex(usu => usu.id == userID)

            userList.splice(userIndex,1,user)
            const dataToJSON = JSON.stringify(userList,null,2);
            fs.writeFileSync(`${this.archivo}` , dataToJSON);
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async addProduct(carritoId,producto){
        try {
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const carrito = JSON.parse(data);
            const carritoElegido = carrito.find( (carro) => carro.id === carritoId );
            const date = new Date().toLocaleString();
            carritoElegido.timestamp = date;
            carritoElegido.products = producto;
            const dataToJSON = JSON.stringify(carrito,null,2);
            fs.writeFileSync(`${this.archivo}` , dataToJSON);
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async getCart(carritoId){
        try{
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const cartList = JSON.parse(data);
            const carritoElegido = cartList.find( (carro) => carro.id === carritoId );

            return carritoElegido;
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async emptyCart(carritoId){
        try{
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const carrito = JSON.parse(data);
            const carritoFiltrado = carrito.filter( (carro) => carro.id !== carritoId );
            const dataToJSON = JSON.stringify(carritoFiltrado,null,2);
            fs.writeFileSync(`${this.archivo}` , dataToJSON);
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async deleteItem(carritoId, productoId){
        try{
            const data = await fs.promises.readFile(this.archivo, 'utf-8');
            const carrito = JSON.parse(data);
            const carritoElegido = carrito.find( (carro) => carro.id === carritoId );
            const date = new Date().toLocaleString();
        
            carritoElegido.timestamp = date;
            const carritoElegidoIndex = carrito.findIndex((carro) => carro.id === carritoId);
            const productosCarrito = carritoElegido.products;
            const producto = productosCarrito.find((carro) => carro.id === productoId)
            if(producto!==undefined){
                const carritoFiltrado = productosCarrito.filter( (carro) => carro.id !== productoId);
                carritoElegido.products.splice(0,productosCarrito.length)
                carritoElegido.products.push(...carritoFiltrado);    
                carrito.splice(carritoElegidoIndex,1,carritoElegido);
                const dataToJSON = JSON.stringify(carrito,null,2);
                fs.writeFileSync(`${this.archivo}` , dataToJSON);
                return true;
            }else{
                return false;
            }
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
            const id = crypto.randomBytes(10).toString('hex');
            const date = new Date().toLocaleString();
            let agregarData= {...user, id: id, orders:[],timestamp: date,admin:false}
                      

            userList.push(agregarData)
            const dataToJSON = JSON.stringify(userList,null,2);
            fs.writeFileSync(`${this.archivo}` , dataToJSON);
            return id;
        }catch(err){
          logger.error('Error: ', err);
          throw err
        }
      }

    async findUser(email) {
        try{
            const objeto = await this.getAll()
            const objetoFiltrado = objeto.filter(obj => obj.email === email);
            if (objetoFiltrado[0]===undefined) {
                return null;
            }else{
            return objetoFiltrado[0];
            }       
        }catch(err){
            logger.error(`Error: ${err}`)
            throw err
        }
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

            await this.addProduct(cart.id, cartProductsList)
            console.log(`Se ha modificado el carrito ${cart.id}`);
            const updatedCart =  await this.getById(cart.id)
            return updatedCart

        }catch(err){
            logger.error(`Error: ${err}`)
            throw err
        }
    }
    
    async createTicket (ticketCompra) {
        try{
            const date = new Date().toLocaleString();
            const id = crypto.randomBytes(10).toString('hex');
            const orders = await this.getAll();
            let nextOrder = 1;

            
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
            price: ticketCompra.price,
            id: id
          }

          orders.push(newTicket)
          const dataToJSON = JSON.stringify(orders,null,2);
          fs.writeFileSync(`${this.archivo}` , dataToJSON);

          logger.info('Ticket creado', newTicket);
          return newTicket.id;
        }catch(err){
                logger.error(`Error: ${err}`)
                throw err
        }
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

        }catch(err){
            logger.error(`Error: ${err}`)
            throw err
        }
    }

    async sendMessage(message){
        try{
            const messages = await this.getAll();
            const id = crypto.randomBytes(10).toString('hex');
            let agregarData;
            agregarData= {...message, id: id}
            messages.push(agregarData);
            const dataToJSON = JSON.stringify(messages,null,2);
            fs.writeFileSync(`${this.archivo}` , dataToJSON);
            return id;
          }catch(err){logger.error(`Error: ${err}`)}
    }
    async getMessageByEmail(email){
        try{
            const chatList = await this.getAll()
            const documents = chatList.filter(chat => chat.email === email);
            if (documents.length === 0) {
                return null;
            } else {
                return documents;
            }
          }catch(err){logger.error(`Error: ${err}`)}
    }
 
}
