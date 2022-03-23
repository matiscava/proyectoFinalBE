import FileContainer from "../../containers/FileContainer.js";

class UserDaoFile extends FileContainer {
 constructor () {
     super('/db/users.json')
 }
};

export default UserDaoFile;