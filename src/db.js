const mysql = require ('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user:"root",
    password: "",
    database:"portifolio"

});
db.connect((err) => {
    if(err){
        console.log('not connected to MySql');
        console.log(err);

    }else{
        console.log(' connected');
    }

});
module.exports = db;
