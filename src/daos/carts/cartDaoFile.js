import FileContainer from "../../containers/FileContainer.js";

class CartDaoFile extends FileContainer {
 constructor () {
     super('/db/carts.json')
 }
};

export default CartDaoFile;
