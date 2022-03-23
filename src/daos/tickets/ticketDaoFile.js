import FileContainer from "../../containers/FileContainer.js";

class TicketDaoFile extends FileContainer {
 constructor () {
     super('/db/tickets.json')
 }
};

export default TicketDaoFile;
