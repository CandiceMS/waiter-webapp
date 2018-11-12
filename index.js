const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
  const session = require('express-session');

const postgres = require('pg');
const Pool = postgres.Pool;

app.use(session({
  secret : "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

let useSSL = false;
if(process.env.DATABASE_URL){
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/waiter_app'

const pool = new Pool({
  connectionString,
  ssl:useSSL
})

let Logic = require('./waiter_logic');
const logic_db = Logic(pool);
const waiterRoutes = require('./waiter_routes');
const waiterRoutesFactory = waiterRoutes(logic_db);



let PORT = process.env.PORT || 3800;

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.listen(PORT, function() {
  console.log('App starting on port', PORT);
});

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('home');
});

app.post('/submit_input', waiterRoutesFactory.submitShifts);
app.get('/shifts', waiterRoutesFactory.returnWaiterShifts);
//  app.get('/filter/:town_name', waiterRoutesFactory.filtered);

app.post('/clear', waiterRoutesFactory.clear);


// app.get('/waiter/:username);
// const username = req.params.username;
// res.render('waiter_shift', { username });     This is the route to get waiter name and persist shift entered
