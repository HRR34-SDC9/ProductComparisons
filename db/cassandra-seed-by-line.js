const cassandra = require('cassandra-driver');
const distance = cassandra.types.distance;

const fs = require('fs');
var readline = require('readline');
var stream = require('stream');

const options = {
    contactPoints: ['localhost'],
    pooling: {
       coreConnectionsPerHost: {
         [distance.local]: 4,
         [distance.remote]: 2
       } ,
       maxRequestsPerConnection : {
        [distance.local]: 2768,
        [distance.remote]: 2000
       }
    },
    keyspace : 'trailblazer'
 };

const client = new cassandra.Client(options);
const truncateTents = 'truncate table tents';
const truncateShirts = 'truncate table shirts';

client.connect()
.catch(() => {
    console.log('error connecting');
    process.exit();
})
.then(() => {
    console.log('truncating tents');
    return client.execute(truncateTents);
 })
.catch(() => {
    console.log('error truncating tents');
    process.exit();
})
.then(() => {
    console.log('truncating shirts');
    return client.execute(truncateShirts);
})
.catch(() => {
   console.log('error truncating shirts');
   process.exit();
})
.then(() => {
    let start = new Date().getTime();
    var count = 0;
    var instream = fs.createReadStream(__dirname + '/inserts.csv');
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);
    rl.on('line', async(line) => {
        let end = new Date().getTime();
        await client.execute(line)
        .catch((err) => {
            console.log(err);
            process.exit();
        });
        console.log(count++ + ':' + (end - start)/1000 +' seconds');//track length of time to insert records
    })
    rl.on('close', function() {
        process.exit();
    });
});