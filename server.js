// Setting up all the required imports
const express = require("express");
const path = require("path");
var fs = require("fs");
var shortid = require('shortid');





// Setting up the server instance and the dynamic port
var app = express();
var PORT = process.env.PORT || 3001;


app.use(express.static(path.join(__dirname, "Develop/public/assets/")));


// Setting up the server parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Routes for static html pages:
app.get(`/notes`, function (req, res) {
    res.sendFile(path.join(__dirname, `Develop/public`, `notes.html`));
});

app.get(`/`, function (req, res) {
    res.sendFile(path.join(__dirname, `Develop/public`, `index.html`));
});

//API Routes
app.get(`/api/notes`, function (req, res) {
    fs.readFile(__dirname + "/Develop/db/db.json", 'utf8', function (err, data) {
        if (err) throw new Error(err);
        let dbFile = JSON.parse(data);
        res.send(dbFile);
    });
});

app.post("/api/notes", function (req, res) {
    fs.readFile(__dirname + "/Develop/db/db.json", 'utf8', function (err, data) {
        if (err) throw new Error(err);
        let dbJson = JSON.parse(data);
        let newNote = {
            title: req.body.title,
            text: req.body.text,
            id: shortid.generate()
        };
        dbJson.push(newNote);
        fs.writeFile(__dirname + "/Develop/db/db.json", JSON.stringify(dbJson, null, 2), (err) => {
            if (err) throw new Error(err);
            res.send('Note saved successfully');
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {

    fs.readFile(__dirname + "/Develop/db/db.json", (err, data) => {
        if (err) throw new Error(err);
        var removeNoteId = req.params.id;
        console.log(removeNoteId);
        let dpObj = JSON.parse(data);
        console.log(dpObj);
        for (let i = 0; i < dpObj.length; i++) {
            if (dpObj[i].id.toString() === removeNoteId) {
                console.log(dpObj[i].id);
                dpObj.splice(i, 1);
            } else {
                console.log("no matching Id");
            }
        }
        fs.writeFile(__dirname + "/Develop/db/db.json", JSON.stringify(dpObj, null, 2), (err) => {
            if (err) throw new Error(err);
            res.send(`Note with id ${removeNoteId} has been removed successfully`);
        });
    });
});



// server listener:
app.listen(PORT, function () {
    console.log("This server is listening to: " + PORT);
});


