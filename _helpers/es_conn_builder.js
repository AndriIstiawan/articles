const { Client } = require('@elastic/elasticsearch')
// const Mock = require('@elastic/elasticsearch-mock')

// const mock = new Mock()
const client = new Client({
    node: process.env.URL_ES,
    timed_out: true,
    // Connection: mock.getConnection()
})

module.exports = {
    client
}