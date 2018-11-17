const fs = require('fs');
const faker = require('faker');

// const data = require('./sample_data.js');

// for (let i = 0; i < data.length; i++) {
//     fs.appendFileSync(__dirname + '/data.csv', data[i] + '\n', (err) => {  
//         if (err) throw err;
//     });
// }
const printer = () => {
    const fil = fs.createWriteStream(__dirname + '/tents_maria.js');
    let i = 0;
    const MAX_LIM = 10000000;

    const writer = function () {
        let result = true;

        // Write to file until we get false as fil.write()'s
        // result
        fil.write(`module.exports=[`);
        while (i <= MAX_LIM && result) {
            result = fil.write(`{image : ${faker.random.number({min:1, max:10})}, `+
                                `tent : '${faker.commerce.productAdjective() + ' ' + faker.commerce.productMaterial()}', `+
                                `rating : ${faker.random.arrayElement([0,.5,1,1.5,2,2.5,3,3.5,4,4.5,5])}, `+
                                `price : ${faker.finance.amount(100,600,2)},`+
                                `capacity : ${faker.random.arrayElement([2,4,6,8,10])}, `+
                                `pounds : ${faker.random.number({min:12, max: 25})}, `+
                                `ounces : ${faker.random.number({min:1, max:15})}, `+
                                `doors : ${faker.random.number({min:1, max:2})}, `+
                                `use : '${faker.random.arrayElement(['Backpacking','Camping','Roof-top','Shelters','Bivy Sacks'])}'},\n`);

            // even if the result is false, our write has been probably
            // written to the buffer. A false value denotes that the our last
            // write has resulted in buffered data, crossing the highWaterMark.
            // So, we have to increment the count.
            i += 1;
        }
        fil.write(`];`);
        // Add an event listener if the last write was not
        // successful
        if (i < MAX_LIM)
        fil.once('drain', writer);
    }
    return writer;
  }
  
 const print= printer();
 print();