const Article = require("./articlesModel");
const { client } = require('../../_helpers/es_conn_builder');

exports.createContent = (title, body, author) => {
    return new Article({
        title: title,
        body: body,
        author: author,
        createdAt: Date.now(),
    }).save();
}

exports.createIndex = async (result) => {
    return client.index({
        index: 'article',
        body: result
    })
}

exports.getByAuhtor = (query) => {
    return client.sql.query({
        body: {
            query: "SELECT * FROM article WHERE title LIKE '%" + query.query + "%' AND author='" + query.author + "' ORDER BY createdAt DESC "
        }
    })
}

exports.getBySearch = (query) => {
    return client.sql.query({
        body: {
            query: "SELECT * FROM article WHERE title LIKE '%" + query.query + "%' ORDER BY createdAt DESC"
        }
    })
}

exports.getById = (articleId) => {
    return client.sql.query({
        body: {
            query: "SELECT * FROM article WHERE id='" + articleId + "'"
        }
    })
}

exports.findById = (articleId, callback) => {
    return Article.findById(articleId, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    });
}

exports.findAll = (query, callback) => {
    return Article.find({
        "$or": [
            { title: { '$regex': query, '$options': 'i' } }
        ]
    }, {}, {}, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result)
    }).sort({ createdAt: -1 }).lean();
}

exports.findByAuthor = (author, query, callback) => {
    return Article.find({
        "$and": [
            { author: author },
            { title: { '$regex': query, '$options': 'i' } }
        ]
    }, {}, {}, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result)
    }).sort({ createdAt: -1 }).lean();
}


exports.functionHelper = (result) => {
    return result.body.rows.map(row => {
        const obj = {}
        for (let i = 0; i < row.length; i++) {
            obj[result.body.columns[i].name] = row[i]
        }
        return obj
    })
}