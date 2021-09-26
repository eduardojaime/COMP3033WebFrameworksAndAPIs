const express = require('express');
const app = express();

app.use('/hello', (req, res) => {
    res.send('Hello World')
});

app.use('/goodbye', (req, res) => {
    res.send('Goodbye World');
});

app.listen(3000);
console.log('Server running at http://localhost:3000');