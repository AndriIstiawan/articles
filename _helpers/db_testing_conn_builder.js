/* building a mongodb URI string based on configs read from .env file
*/
const { MongoMemoryServer } = require('mongodb-memory-server'),
    mongoose = require('mongoose');

const dbtestingConnBuilder = async () => {
    const mongoUri = await new MongoMemoryServer().getUri();
    mongoose.connect(mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            console.log(err)
        }
        console.log('connected')
    });
    mongoose.connection.on('error', error => console.log(error));
}


module.exports = dbtestingConnBuilder;
