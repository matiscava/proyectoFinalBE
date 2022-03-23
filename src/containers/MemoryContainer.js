import logger from './../logger/index.js';

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
            let nextID = 1
            let agregarData;
            if(objeto.length===0){
                agregarData= {...objetoNuevo, id: nextID, timestamp: fecha}
            }else{
                for (let i=0;i<objeto.length ;i++) {
                    while( objeto[i].id >= nextID ){
                        nextID++;
                    }
                }
                agregarData= {...objetoNuevo, id: nextID, timestamp: fecha}
            }
            this.array.push(agregarData);
            return agregarData;
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
            let nextID = 1;
            let carritoNuevo;
            const fecha = new Date().toLocaleString();
            if(objeto.length===0){
                carritoNuevo={id: nextID, timestamp: fecha, products:[] }
            }else{
                for (let i=0;i<objeto.length ;i++) {
                    while( objeto[i].id >= nextID ){
                        nextID++;
                    }
                }
                carritoNuevo={id: nextID, timestamp: fecha, products:[]}
            }
            this.array.push(carritoNuevo);
            
            return nextID;
        } catch (error) {
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

    async agregarXId(carritoId,arrayProductos){
        try{
            
            const carritos = this.array;
            const carritoElegido = carritos.find( (carro) => carro.id === carritoId );
            const carritoElegidoIndex = carritos.findIndex((carro) => carro.id === parseInt(carritoId));
            const fecha = new Date().toLocaleString();
        
            carritoElegido.timestamp = fecha;
            arrayProductos.forEach((produ) => {
            
                const productoRepetido = carritoElegido.products.find( (producto) => producto.id === produ.id);
                if(productoRepetido===undefined){
                    carritoElegido.products.push(produ);
                }else{
                    productoRepetido.timestamp=fecha
                    productoRepetido.quantity+=produ.quantity;
                }

            });
    
            this.array.splice(carritoElegidoIndex,1,carritoElegido);
        } catch (error) {
            logger.error('Error: ', error);
            throw error;
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
}

export default MemoryContainer