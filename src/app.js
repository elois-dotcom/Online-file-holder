//making my server
// Multer for file uploads 
//Ejs for UI
const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./db.js'); // imported from MySQL connection
const multer = require('multer');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// configuring storage using multer 
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    const sql = "SELECT * FROM uploads"; // Fetching documents from the database
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', { uploads: results }); // Passing documents to the template
    });
});

// route to handle file uploads 
app.post('/upload', upload.single('uploads'), (req, res) => {
    const filename = req.file.filename;
    const file_path = '/uploads/' + filename;

    const sql = "INSERT INTO uploads (filename, file_path) VALUES (?, ?)"; // Inserting documents into the database
    db.query(sql, [filename, file_path], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    const sql = "DELETE FROM uploads WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});
app.get('/edit/:id',(req,res)=>{
    const sql = "SELECT * FROM uploads WHERE id = ?";
    db.query(sql,[req.params.id],(err,result)=>{
        if(err) throw err;
        res.render('edit',{upload:result[0]});
    });
});
app.post('/edit/:id',upload.single('uploads'),(req,res)=>{
    const {filename} = req.body;
    let file_path = req.body.file_path;
    if (req.file){
        file_path = '/uploads/' + req.file.filename;
    }
    
    const sql = "UPDATE uploads SET filename = ?, file_path = ? WHERE id = ?";
    db.query(sql,[filename,file_path,req.params.id],(err,result)=>{
        if(err) throw err;
        res.redirect('/');
    });
});

// start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});