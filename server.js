require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();

// NEW
const session = require('express-session'); // Ok we use this to monitor when someone is "logged in" and when they "logout".
const flash = require('connect-flash'); // This communicates to the user when there are errors or success

const SECRET_SESSION = process.env.SECRET_SESSION;

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
