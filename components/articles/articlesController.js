const { client } = require('../../_helpers/es_conn_builder');
const { articlesValidation } = require('./articlesValidation'),
    { createContent, findById, findAll, findByAuthor, createIndex, getByAuhtor, getBySearch, functionHelper, getById } = require('./articlesServices');

const mongoose = require('mongoose')

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

        if (process.env.NODE_ENV === '') {
            await createIndex(result)
        }

        return res.status(201).json({ success: true });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Error creating content", err: err });
    }
};

exports.findAll = async (req, res) => {
    try {
        if (process.env.NODE_ENV === '') {
            let result
            if (req.query.author != '') {
                result = await getByAuhtor(req.query)
            } else {
                result = await getBySearch(req.query)
            }
            const data = await functionHelper(result)
            return res.status(200).json(data);
        } else {
            if (req.query.author != '') {
                data = await findByAuthor(req.query.author, req.query.query, () => { })
            } else {
                data = await findAll(req.query.query, () => { })
            }
            return res.status(200).json(data)
        }
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
};

// FIND an VR Content
exports.findOne = async (req, res) => {
    try {
        const objectId = mongoose.Types.ObjectId.isValid(req.params.articleId);
        if (!objectId) {
            return res.status(400).json({ message: 'Invalid id' })
        }

        let data;
        if (process.env.NODE_ENV === '') {
            const result = await getById(req.params.articleId)
            if (result.body.rows.length < 1) {
                return res.status(404).json({ message: 'article not found' })
            }
            data = await functionHelper(result)
            return res.status(200).json(data[0])
        } else {
            data = await findById(req.params.articleId, () => { })
            if (!data) {
                return res.status(404).json({ message: 'article not found' })
            }
            return res.status(200).json(data)
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};
