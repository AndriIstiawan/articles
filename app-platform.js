const bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    express = require('express'),
    cors = require('cors');
// Config File
const CONFIG = require('./config/config');

const apiNewsRoute = require('./components/articles/articlesRouteAPI');

const dbConnBuilder = require('./_helpers/db_conn_builder');
const { client } = require('./_helpers/es_conn_builder');
const dbTestingConnBuilder = require('./_helpers/db_testing_conn_builder');
const app = express();

// App setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// App config
app.use(methodOverride('_method')); // has to be declared before any route
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, sid'
    );
    res.header(
        'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT'
    );
    next();
});

// Log the environment
console.log('Environment:', CONFIG.app);
console.log('NODE_ENV:', process.env.NODE_ENV);

mongoose.Promise = global.Promise;
// DB Setup
if (process.env.NODE_ENV === 'integration-test') {
    dbTestingConnBuilder()
} else if (process.env.NODE_ENV === '') {
    const dbConnUri = dbConnBuilder(CONFIG);
    console.log('Connection URI:', dbConnUri);
    mongoose.connect(dbConnUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            console.log(err)
        }
        console.log('connected')
    });
    mongoose.connection.on('error', error => console.log(error));
}

// Main App Route
app.get('/', function (req, res) {
    res.json({ message: "This is the api server main route", status: "OK" });
});
// API Routes
app.use('/api/v1/', apiNewsRoute);

//run seeder
// client.ping({
//     requestTimeout: 3000
// }, function (error) {
//     if (error) {
//         console.trace('elasticsearch cluster is down!');
//     } else {
//         console.log('Elastic search is running.');
//     }
// });

app.listen(process.env.PORT || 4000, function () {
    console.log('Application is running.. ');
    console.log(`Open in your browser ${CONFIG.ip_address}`);
});

module.exports = app;
