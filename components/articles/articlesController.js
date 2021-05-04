const { client } = require('../../_helpers/es_conn_builder');
const { articlesValidation } = require('./articlesValidation'),
    { createContent } = require('./articlesServices');

// CREATE an VR Content
exports.create = async (req, res) => {
    const { error, value } = articlesValidation(req.body);
    if (error) {
        return res.status(400).json(error.details[0].message)
    }

    try {
        const { title, body, author } = value;
        const data = await createContent(title, body, author);

        const result = {
            id: data.id,
            title: data.title,
            body: data.body,
            author: data.author,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }

        await client.index({
            index: 'article',
            body: result
        })
        return res.status(201).json({ success: true });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Error creating content", err: err });
    }
};

exports.findAll = async (req, res) => {
    try {
        let result
        if (req.query.author != '') {
            result = await client.sql.query({
                body: {
                    query: "SELECT * FROM article WHERE title LIKE '%" + req.query.query + "%' AND author='" + req.query.author + "' ORDER BY createdAt DESC "
                }
            })
        } else {
            result = await client.sql.query({
                body: {
                    query: "SELECT * FROM article WHERE title LIKE '%" + req.query.query + "%' ORDER BY createdAt DESC"
                }
            })
        }

        const data = result.body.rows.map(row => {
            const obj = {}
            for (let i = 0; i < row.length; i++) {
                obj[result.body.columns[i].name] = row[i]
            }
            return obj
        })

        return res.status(200).json(data);
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
};

// FIND an VR Content
exports.findOne = async (req, res) => {
    try {
        result = await client.sql.query({
            body: {
                query: "SELECT * FROM article WHERE id='" + req.params.articleId + "'"
            }
        })

        const data = result.body.rows.map(row => {
            const obj = {}
            for (let i = 0; i < row.length; i++) {
                obj[result.body.columns[i].name] = row[i]
            }
            return obj
        })

        return res.status(200).json(data[0])
    } catch (err) {
        return res.status(500).json(err);
    }
};
