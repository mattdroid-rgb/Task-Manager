const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "", 
    database: "task_manager",
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Could not connect to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
    res.send('Hello, Node.js!');
  });


// Get all tasks
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks ORDER BY id DESC' , (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Add a new task
app.post('/tasks', (req, res) => {
    const newTask = req.body;
    db.query('INSERT INTO tasks (title) VALUES (?)', [newTask.title], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: results.insertId, title: newTask.title, completed: false });
    });
});

// Update task completion status
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body; 
    db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], (err) => {
        if (err) return res.status(500).send(err);
        res.sendStatus(204); 
    });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send(); 
    });
});

// Start the server

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
