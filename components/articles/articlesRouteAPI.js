const express = require('express');
const router = express.Router();
const newsContents = require('./articlesController');

// Create new VR content
router.post('/articles', newsContents.create);

// Retrieve public and user's own VR content after user logged in
router.get('/articles', newsContents.findAll);

// Retrieve one VR content
router.get('/articles/:articleId', newsContents.findOne);

module.exports = router;
