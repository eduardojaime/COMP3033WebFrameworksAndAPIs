const express = require('express');
const app = express();

// GET Handler
app.use('/hello', (req, res) => {
    res.send('Hello world!');
});

// GET Handler
app.use('/goodbye', (req, res) => {
    res.send('Goodbye World!');
});

app.listen(3000);
console.log('Server is running on http://localhost:3000');