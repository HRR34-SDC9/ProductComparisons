const fs = require('fs');
const faker = require('faker');

const printer = () => {
    const file = fs.createWriteStream(__dirname + '/shirts_cassandra.csv');
    let i = 0;
    const MAX_LIM = 5000000; //number of records to create

    file.write(`id, imageURL, title, ranking, reviews, price, productType\n`);
    const writer = function () {
        let result = true;

        // Write to file until we get false as result
        while (i < MAX_LIM && result) {
            result = file.write(`${i+1},https://s3-us-west-1.amazonaws.com/trailblazer-images/shirt_${faker.random.number({min:1, max:25})}.jpg,`+
                                `${faker.commerce.productAdjective() + ' ' + faker.commerce.productMaterial()},`+
                                `${faker.random.arrayElement([0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5])},`+
                                `${faker.random.number({min:0, max: 99})},`+
                                `${faker.finance.amount(10,65,2)},`+
                                `Shirt\n`);

            // even if the result is false, our write has been probably
            // written to the buffer. A false value denotes that the our last
            // write has resulted in buffered data, crossing the highWaterMark.
            // So, we have to increment the count.
            i += 1;
        }
        // Add an event listener if the last write was not successful
        if (i < MAX_LIM)
        file.once('drain', writer);
    }
    return writer;
  }
  
 const print= printer();
 print();