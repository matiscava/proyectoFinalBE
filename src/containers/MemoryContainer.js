import logger from './../logger/index.js';
import crypto from 'crypto';


class MemoryContainer {
    constructor ( array ) {
        this.array = array;
    }
    async getAll(){ 
        try{ 
            return await this.array;
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }
    async getById (idNum) {
        try{
            
            const objetoFiltrado = await this.array.filter(obj => obj.id === parseInt(idNum));
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
            const fecha = new Date().toLocaleString();
            const id = crypto.randomBytes(10).toString('hex');
            
            let agregarData= {...objetoNuevo, id: id, timestamp: fecha}

            this.array.push(agregarData);
            return id;
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }
    async deleteById(idNum){
        try{
            const elementoIndex = lista.findIndex((obj)=> obj.id === parseInt(idNum))
            this.array.splice(elementoIndex,1)
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }
    async update(id,elemento){
        try{
            const data = this.array;
            const elementoGuardado = data.find((obj)=> obj.id === parseInt(id))
            const elementoIndex = data.findIndex((obj)=> obj.id === parseInt(id))
            if (!elementoGuardado){
                logger.error(`El elemento con el id: ${id}, no existe`);
                return null;
            }
            const elementoSubido= {
                ...elementoGuardado,
                ...elemento
            }
            this.array.splice(elementoIndex,1,elementoSubido)

            return elementoSubido;
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }
    async newCart(){
        try{
            const objeto = this.array;
            const fecha = new Date().toLocaleString();
            const id = crypto.randomBytes(10).toString('hex');

            let carritoNuevo={id: id, timestamp: fecha, products:[] }

            this.array.push(carritoNuevo);
            
            return id;
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async addCartToUser(userID,cartID){
        try{
            const user = await this.getById(userID);
            const userList = this.array;
            const date = new Date().toDateString();
            if(user.cart){
                return null
            }else{
                const userIndex =  userList.findIndex((obj) => obj.id === parseInt(userID))
                user.cart = cartID;
                user.timestamp = date;
                this.array.splice(userIndex,1,user)
            }
        }catch(err){
            logger.error('Error: ', err);
            throw err;
        }
    }

    async addUserToCart(cartId,user){
        try{
            const fecha = new Date().toLocaleString();
            let { email: userEmail , adress: userAdress } = user;

            const carritos = this.array;
            const elemento = {adress: userAdress, email: userEmail,timestamp:fecha}
            
            const elementoGuardado = carritos.find((obj)=> obj.id === parseInt(cartId))
            const elementoIndex = carritos.findIndex((obj)=> obj.id === parseInt(cartId))
            if (!elementoGuardado){
                logger.error(`El elemento con el id: ${id}, no existe`);
                return null;
            }
            const elementoSubido= {
                ...elementoGuardado,
                ...elemento
            }
            this.array.splice(elementoIndex,1,elementoSubido)    
        }catch(err){
          logger.error('Error: ', err);
          throw err;
        }
    }

    async closeCart(userID,ticketID){
        try{
            const date = new Date().toLocaleString();
            const user = await this.getById(userID);
            const userList = this.array;
            const userIndex =  userList.findIndex((obj) => obj.id === parseInt(userID))
            user.cart = '';
            user.oreder.push(ticketID)
            user.timestamp = date;
            this.array.splice(userIndex,1,user)
        }catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async addProduct(carritoId,producto){
        try {
            const carrito = this.array;
            const carritoElegido = carrito.find( (carro) => carro.id === parseInt(carritoId) );
            const fecha = new Date().toLocaleString();
            carritoElegido.timestamp = fecha;
            carritoElegido.products = producto;
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async getCart(carritoId){
        try{
            const carrito = this.array;
            const carritoElegido = await carrito.find( (carro) => carro.id === parseInt(carritoId) );
            logger.info(carritoElegido);
            return carritoElegido;
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async emptyCart(carritoId){
        try{
            const carrito = this.array;
            const carritoElegidoIndex = carrito.findIndex((carro) => carro.id === parseInt(carritoId));
            this.array.splice(carritoElegidoIndex,1);
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async deleteItem(carritoId, productoId){
        try{
            const carrito = this.array;

            const carritoElegido = carrito.find( (carro) => carro.id === parseInt(carritoId) );
            const fecha = new Date().toLocaleString();
        
            carritoElegido.timestamp = fecha;
            const carritoElegidoIndex = carrito.findIndex((carro) => carro.id === parseInt(carritoId));
            const productosCarrito = carritoElegido.products;
            const producto = productosCarrito.find((carro) => carro.id === parseInt(productoId))
            if(producto!==undefined){
                const carritoFiltrado = productosCarrito.filter( (carro) => carro.id !== parseInt(productoId));
                carritoElegido.products.splice(0,productosCarrito.length)
                carritoElegido.products.push(...carritoFiltrado);    
                this.array.splice(carritoElegidoIndex,1,carritoElegido);
                return true;
            }else{
                return false;
            }
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
        }
    }

    async createUser (user){
        try{
            const userList = this.array;
            const id = crypto.randomBytes(10).toString('hex');
            
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

            let agregarData= {...user, id: id}

            this.array.push(agregarData)

            return id;
        }catch(err){
            logger.error('Error: ', err);
            throw err;
        }
    }

    async findUser(email){
        try{
            const user = await this.array.find(usu => usu.email === email);
            return user;
          }catch(err){logger.error(`Error: ${err}`)}
    }

    async previewTicket(cart,productsList){
        try{
            const cartProductsList = cart.products;
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
          }catch(err){logger.error(`Error: ${err}`)}
    }

    async createTicket(ticketCompra){
        try{
            const date = new Date().toLocaleString();
            let nextOrder = 1;
            const id = crypto.randomBytes(10).toString('hex');
            const orders = await this.array;
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
                id: id,
            }            
            logger.info(newTicket);
            this.array.push(newTicket)
            return newTicket.id
          }catch(err){logger.error(`Error: ${err}`)}
    }

    async updateStock(cartProducts){
        try{
            const productsList = await this.getAll();
            const newStock = []
            cartProducts.forEach(prod => {
              const productRepeated =  productsList.find( (product) => product.id === prod.id )    
              productRepeated.stock -= prod.quantity;
        
              if(productRepeated.stock < 0) productRepeated.stock=0;
      
              newStock.push({id: productRepeated.id, stock: productRepeated.stock})
              for( let i = 0 ; i < newStock.length ; i++){
                const updatedProduct = this.update(newStock[i].id , {stock: newStock[i].stock})
                console.log(`Se ha modificado el producto id: ${newStock[i].id}`);
               }
            });
          }catch(err){logger.error(`Error: ${err}`)}
    }

    async sendMessage(message){
        try{
            const id = crypto.randomBytes(10).toString('hex');
            let agregarData= {...message, id: id}
            this.array.push(agregarData)
            return id;
          }catch(err){logger.error(`Error: ${err}`)}
    }
    async getMessageByEmail(email){
        try{
            const documents = await this.array.filter(chat => chat.email === email);
            if (documents.length === 0) {
                return null;
            } else {

                return documents;
            }
          }catch(err){logger.error(`Error: ${err}`)}
    }

}

export default MemoryContainer