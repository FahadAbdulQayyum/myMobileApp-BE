const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.json({ msg: 'Welcome to the Contact Manager App' }))

// Define Routes Here
app.use('/api/users', require('./routers/users'));
app.use('/api/auth', require('./routers/auth'));
app.use('/api/contacts', require('./routers/contacts'));

const PORT = process.env.PORT || 5000;
// const PORT = process.env.PORT || 80;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));