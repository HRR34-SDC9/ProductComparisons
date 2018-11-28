require('newrelic');
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cassandra = require('cassandra-driver')

const client = new cassandra.Client({ contactPoints: ['localhost'], keyspace : 'trailblazer'})


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
  let query = '';
    if (productId <= 51)
      query = `SELECT * from trailblazer.tents where id=${productId} allow filtering`;
    else
      query = `SELECT * from trailblazer.shirts where id=${productId} allow filtering`;
  client.execute(query, (err, result) => {
    if (err) 
      res.status(400).send(`could not find tent with id ${productId}.`);
    else
      res.status(200).send(result.rows);
  });
});

app.get("/data/shirts", (req, res) => {
  client.execute(`SELECT * from trailblazer.shirts where id < 5 allow filtering`, (err, result) => {
    if (err) 
      res.status(400).send(`could not find shirts.`);
    else
      res.status(200).send(result.rows);
  });
});

app.get("/data/tents", (req, res) => {
  client.execute(`SELECT * from trailblazer.tents where id < 6 allow filtering`, (err, result) => {
    if (err) 
      res.status(400).send(`could not find tents.`);
    else
      res.status(200).send(result.rows);
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
