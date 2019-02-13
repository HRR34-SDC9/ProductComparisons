/* eslint-disable spaced-comment */
/* eslint-disable prettier/prettier */
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: ['localhost']});

client.connect((err) => {
    if (err) console.log('cassandra could not connect');
    console.log('cassandra connected')
});

//create new keyspace
const db = "create keyspace if not exists trailblazer with replication = " + 
           "{'class':'SimpleStrategy','replication_factor':3}";

//create table for tents          
const createTents = `create table if not exists trailblazer.tents (id int,`+ 
                    `"imageURL" text, title text, ranking double, reviews int, price double,`+ 
                    `"sleepingCapacity" text, "packagedWeight" text, "numberOfDoors" int,`+ 
                    `"bestUse" text, "productType" text, ` +
                    `PRIMARY KEY ((title, "bestUse"), id))`;

//create table for shirts 
const createShirts = `create table if not exists trailblazer.shirts (id int,`+ 
                      `"imageURL" text, title text, ranking double,`+ 
                      `reviews int, price double, "productType" text, ` +
                      `PRIMARY KEY (title, id))`;

client.execute(db)
  .catch(() => {
    console.log('error creating db');
    process.exit();
  })
  .then(() => {
    return client.execute('drop table if exists trailblazer.tents')
  })
  .catch(() => {
    console.log('error dropping tents');
    process.exit();
  })
  .then(() => {
    return client.execute('drop table if exists trailblazer.shirts')
  })
  .catch(() => {
    console.log('error dropping shirts');
    process.exit();
  })
  .then(() => {
    return client.execute(createTents)
  })
  .catch((err) => {
    console.log('error creating tents');
    console.log(err);
    process.exit();
  })
  .then(() => {
    return client.execute(createShirts)
  })
  .catch((err) => {
    console.log('error creating shirts');
    console.log(err);
    process.exit();
  })
  .then(() => {
    process.exit();
  });

