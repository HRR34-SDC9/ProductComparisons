exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('tents', table => {
            table.increments('id')
            table.string('imageURL')
            table.string('title')
            table.decimal('ranking')
            table.integer('reviews')
            table.decimal('price')
            table.string('sleepingCapacity')
            table.string('packagedWeight')
            table.integer('numberOfDoors')
            table.string('bestUse')
            table.string('productType')
        }),
      knex.schema.createTable('shirts', (table) => {
        table.increments('id')
        table.string('imageURL')
        table.string('title')
        table.decimal('ranking')
        table.integer('reviews')
        table.decimal('price')
        table.string('productType')
      })
    ]);
  };

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tents'),
    knex.schema.dropTable('shirts')
  ]);
};