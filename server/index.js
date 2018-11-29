require('newrelic');
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mariadb = require("mariadb");

const pool = mariadb.createPool({host: 'localhost', user:'root', database: 'trailblazer', connectionLimit: 5});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/../client/dist`, { maxAge: '365d' })); //setting cache heading to save this file on your computer for a year and if a file requests then do'nt get it just use the saved copy
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes-Endpoints
app.get("/product/:id", (req, res) => {
  const file = path.join(`${__dirname}/../client/dist/index.html`);
  res.sendFile(file); // When using sendFile if you have '..' in the file name the browser thinks its malicious. Need to use path.join or path.resolve to bypass'
});

app.get("/product/data/:id", (req, res) => {
  let productId = req.params.id;
  pool.getConnection()
  .then(conn => {
    let query = '';
    if (productId <= 51)
      query = `SELECT * from trailblazer.tents where id=${productId}`;
    else
      query = `SELECT * from trailblazer.shirts where id=${productId}`; 
    conn.query(query)                                                                                                                             
    .then(result => {             
        res.status(200).send(result);
        conn.end();
    })
    .catch(() => {
      res.status(400).send('could not find tent with id ${productId}.');
      conn.end();
    })
  })
  .catch(() => {
    res.status(400).send('could not connect to database');
  })
});

app.get("/data/shirts", (req, res) => {
  pool.getConnection()
  .then(conn => {
    conn.query(`SELECT * from trailblazer.shirts limit 4`)                                                                                                                             
    .then(result => {                          
      res.status(200).send(result);
      conn.end();
    })
    .catch(() => {
      res.status(400).send('could not find shirts.');
      conn.end();
    })
  })
});

app.get("/data/tents", (req, res) => {
  pool.getConnection()
  .then(conn => {
    conn.query(`SELECT * from trailblazer.tents limit 5`)                                                                                                                             
    .then(result => {                 
      res.status(200).send(result);
      conn.end();
    })
    .catch(() => {
      res.status(400).send('could not find tents.');
      conn.end();
    })
  })
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
