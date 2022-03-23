import FileContainer from "../../containers/FileContainer.js";

class ChatDaoFile extends FileContainer {
 constructor () {
     super('/db/chats.json')
 }
};

export default ChatDaoFile;