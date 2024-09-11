const { fileLoader } = require("ejs");
const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.engine('ejs', require('ejs').__express);
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        if (err) {
            return res.status(500).send("Error reading files");
        }
        res.render("index", { files: files });
    });
});

app.get('/files/:filename' , (req , res)=>{
    fs.readFile(`./files/${req.params.filename}`, "utf-8" ,function(err , filedata){
        res.render('show' , {filename: req.params.filename , filedata:filedata})
    })
})

app.get('/edit/:filename' , (req , res)=>{
    res.render('edit', {filename: req.params.filename});
})

app.post('/edit', (req, res) => {
    const oldname = path.join(__dirname, 'files', req.body.previous);
    const newName = path.join(__dirname, 'files', req.body.new);

    fs.rename(oldname, newName, (err) => {
        if (err) {
            console.error("Error renaming file:", err);
            return res.status(500).send("Error renaming file");
        }
        res.redirect("/");
    });
});

app.post('/create', (req, res) => {
    const fileName = req.body.title.split(' ').join('');
    fs.writeFile(`./files/${fileName}.txt`, req.body.details, (err) => {
        if (err) {
            return res.status(500).send("Error writing file");
        }
        res.redirect("/");
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
