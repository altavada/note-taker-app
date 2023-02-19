const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    })
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        const priorNotes = JSON.parse(fs.readFileSync('./db/db.json'));
        priorNotes.push(newNote);
        fs.writeFileSync('./db/db.json', JSON.stringify(priorNotes), (err) => {
            err 
            ? console.log(err) 
            : console.log(`Review for ${newNote.title} has been written to JSON file`)
        });
        const response = {
            status: 'success',
            body: newNote,
        };
        console.log(response);
        return res.json(response);
    } else {
        res.status(500).json('Error in posting review');
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
