const fs = require('fs');
const faker = require('faker');
const fileName = __dirname + '/inserts.csv';

const printer = () => {
    const file = fs.createWriteStream(fileName);
    let i = 0;
    const MAX_LIM = 5000000; //number of records per table

    let start = new Date().getTime();
    const writer = function () {
        let result = true;

        // Write to file until we get false as result
        while (i < MAX_LIM && result) {
            result = file.write(`insert into trailblazer.tents (id, `+
                                `"imageURL", title, ranking, reviews, price, "sleepingCapacity", `+
                                `"packagedWeight", "numberOfDoors", "bestUse", "productType") `+
                                `values (`+
                                `${i+1},'https://s3-us-west-1.amazonaws.com/trailblazer-images/tent_${faker.random.number({min:1, max:25})}.jpg',`+
                                `'${faker.commerce.productAdjective() + ' ' + faker.commerce.productMaterial()}',`+
                                `${faker.random.arrayElement([0,.5,1,1.5,2,2.5,3,3.5,4,4.5,5])},`+
                                `${faker.random.number({min:0, max: 99})},`+
                                `${faker.finance.amount(100,600,2)},`+
                                `'${faker.random.arrayElement([2,4,6,8,10])} people',`+
                                `'${faker.random.number({min:12, max: 25})} lbs ${faker.random.number({min:1, max:15})} oz.',`+
                                `${faker.random.number({min:1, max:2})},`+
                                `'${faker.random.arrayElement(['Backpacking','Camping','Roof-top','Shelters','Bivy Sacks'])}',`+
                                `'Tent')\n`);
            result = file.write(`insert into trailblazer.shirts (id, "imageURL", title, ranking, reviews, price, "productType") `+
                                `values (`+
                                `${i+1},'https://s3-us-west-1.amazonaws.com/trailblazer-images/shirt_${faker.random.number({min:1, max:25})}.jpg',`+
                                `'${faker.commerce.productAdjective() + ' ' + faker.commerce.productMaterial()}',`+
                                `${faker.random.arrayElement([0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5])},`+
                                `${faker.random.number({min:0, max: 99})},`+
                                `${faker.finance.amount(10,65,2)},`+
                                `'Shirt')\n`);

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
    let end = new Date().getTime();
    console.log((end - start)/1000 +' seconds');//keep track of time to create records
    return writer;
  }
  
 const print= printer();
 print();