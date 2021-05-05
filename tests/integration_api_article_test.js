const Article = require('../components/articles/articlesModel');

const request = require('supertest');

// Require the dev dependencies
let expect = require("chai").expect,
    app = require('../app-platform');

// API v1 Tests
let apiRootUri = '/api/v1';

// Main block
describe("Article API v1", () => {
    // Starting from here, we need user auth
    // Emptying the database before each test
    before((done) => {
        // Reset Arcontent mode before each test
        Article.deleteMany({}, () => {
            done()
        })
    })
    after((done) => {
        Article.deleteMany({}, () => {
            done();
        });
    });

    // Test the GET route
    describe("/GET Article ", () => {
        context("when get ALL", () => {
            it("it should GET empty array in the beginning", (done) => {
                request(app)
                    .get(apiRootUri + "/articles/?query=&author=")
                    .end(function (_err, response) {
                        // the res object should have a status of 200)
                        expect(response.statusCode).to.equal(200)
                        done()
                    });
            });

            it("it should GET All Article ", (done) => {
                new Article({
                    title: 'dagronfryer',
                    body: 'live again',
                    author: 'admin',
                }).save()
                request(app)
                    .get(apiRootUri + "/articles/?query=&author=")
                    .end(function (_err, response) {
                        // the res object should have a status of 200)
                        expect(response.statusCode).to.equal(200)
                        expect(response.body).to.be.an('array');
                        expect(response.body[0].title).to.equal('dagronfryer');
                        done()
                    });
            });

            it("it should GET All Article by query from all author", (done) => {
                new Article({
                    title: 'dagronfryer 2',
                    body: 'live again 2',
                    author: 'admin',
                }).save()
                new Article({
                    title: 'dagronfryer 3',
                    body: 'live again 3',
                    author: 'admin 2',
                }).save()
                request(app)
                    .get(apiRootUri + "/articles/?query=dagronfryer&author=")
                    .end(function (_err, response) {
                        // the res object should have a status of 200)
                        expect(response.statusCode).to.equal(200)
                        expect(response.body).to.be.an('array');
                        expect(response.body.length).to.equal(3);
                        done()
                    });
            });

            it("it should GET All Article by query and by author", (done) => {
                request(app)
                    .get(apiRootUri + "/articles/?query=dagronfryer&author=admin")
                    .end(function (_err, response) {
                        // the res object should have a status of 200)
                        expect(response.statusCode).to.equal(200)
                        expect(response.body).to.be.an('array');
                        expect(response.body.length).to.equal(2);
                        done()
                    });
            });
        })

        context("when find by id", () => {
            it('it should return One Article by given id', (done) => {
                let newArtcile = new Article({
                    title: 'dagronfryer',
                    body: 'live again',
                    author: 'admin',
                })
                newArtcile.save((err, article) => {
                    request(app)
                        .get(apiRootUri + "/articles/" + article.id)
                        .end(function (_err, response) {
                            expect(response.statusCode).to.equal(200)
                            expect(response.body.title).to.equal('dagronfryer')
                            done()
                        });
                });
            });

            it('it should return error if input id is invalid', (done) => {
                request(app)
                    .get(apiRootUri + "/articles/" + '5dd2d5b813daa055811c7')
                    .end(function (_err, response) {
                        expect(response.statusCode).to.equal(400)
                        done()
                    });
            });

            it('it should return error when given false id', (done) => {
                request(app)
                    .get(apiRootUri + "/articles/" + '123123123112312312311234')
                    .end((err, resp) => {
                        expect(resp.statusCode).to.equal(404);
                        done();
                    });
            });
        })

    });

    // Test the POST route
    describe("/POST Article ", () => {
        context("with complete data", () => {
            it("it should POST a Article that has complete field", (done) => {
                request(app)
                    .post(apiRootUri + "/articles")
                    .send({ title: 'kumparan articles' })
                    .send({ body: 'news' })
                    .send({ author: 'admin' })
                    .end(function (_err, resp) {
                        expect(resp.statusCode).to.equal(201)
                        expect(resp.body.success).to.equal(true)
                        done()
                    })
            })
        })

        context("with incomplete data", () => {
            it("it should not able to POST a Article that has missing field", (done) => {
                request(app)
                    .post(apiRootUri + "/articles")
                    .send({ title: '' })
                    .end(function (_err, response) {
                        expect(response.statusCode).to.equal(400)
                        done()
                    })
            })
        })
    })
});
