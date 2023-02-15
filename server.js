const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const uuid = require('./helpers/uuid');
const fs = require('fs');
const PORT = 3001;
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

app.get('/api/notes', (req, res) => res.json(db));

app.post('/api/notes', async (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        }
        const priorNotes = JSON.parse(await fs.readFileSync('./db/db.json'));
        priorNotes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(priorNotes), (err) => 
            err ? console.log(err) : res.json('./db/db.json'));
        const response = {
            status: 'success',
            body: newNote,
        };
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting review');
    }
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
