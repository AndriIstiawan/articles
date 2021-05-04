const Article = require("./articlesModel");

exports.createContent = (title, body, author) => {
    return new Article({
        title: title,
        body: body,
        author: author,
        createdAt: Date.now(),
    }).save();
}
