import FileContainer from "../../containers/FileContainer.js";

class ProductDaoFile extends FileContainer {
 constructor () {
     super('/db/products.json')
 }
};

export default ProductDaoFile;
