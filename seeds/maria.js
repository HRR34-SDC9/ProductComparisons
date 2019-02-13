//seed all records to cassandra database
exports.seed = (knex, Promise) => {
  return knex('tents').truncate()
    .then(() => {
      return knex('shirts').truncate();
    })
    .then(() => {
      return knex.raw(`LOAD DATA LOCAL INFILE 'db/tents_maria.csv' INTO TABLE trailblazer.tents fields terminated BY "," lines terminated BY "\n" (imageURL, title, ranking, reviews, price, sleepingCapacity, packagedWeight, numberOfDoors, bestUse, productType)`)
    })
    .then(() => {
      return knex.raw(`LOAD DATA LOCAL INFILE 'db/shirts_maria.csv' INTO TABLE trailblazer.shirts fields terminated BY "," lines terminated BY "\n" (imageURL, title, ranking, reviews, price, productType)`)
    });
};