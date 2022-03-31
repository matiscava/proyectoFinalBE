import MemoryContainer from "../../containers/MemoryContainer.js";

class UserDaoMemory extends MemoryContainer {
 constructor () {
     super([
         {
            "username": "matiscava",
            "password": "$2b$10$MFuBSnPnK68BtSnHhweNyeiAqOrMoaLUjxYnSCKHNOtoWbnKGNzP6",
            "email": "matiscava@hotmail.com",
            "name": "matias",
            "lastname": "scavarelli",
            "phone": "11 5563 3083",
            "adress": "ascas 123",
            "photo": "https://static.wikia.nocookie.net/esstarwars/images/5/56/Chewie1.jpg/revision/latest/top-crop/width/360/height/450?cb=20110816111434",
            "cart": "",
            "id": 1,
            "orders": [],
            "timestamp": "25/3/2022 12:32:22",
            "admin": false
        },
        {
            "username": "admin",
            "password": "$2b$10$/YTiaE3D0HnavY0aAQzpReUrBfWJTdfwVloNKVD3qQGFtl5vMIPoO",
            "email": "jorgecoronabackend@gmail.com",
            "name": "admin",
            "lastname": "istrador",
            "phone": "11 5563 3083",
            "adress": "calle falsa 123",
            "photo": "https://cinematicos.net/wp-content/uploads/Una-explicacion-de-la-historia-de-Neo-de-The-Matrix.jpg",
            "cart": "",
            "orders": [],
            "id": 2,
            "timestamp": "25/3/2022 15:14:52",
            "admin": true
        }   
    ])
 }
};

export default UserDaoMemory;