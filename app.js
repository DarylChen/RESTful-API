const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB")

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema)


///////////////////////Requests Targeting All Articles////////////////////
app.route("/articles")
    .get(function(req, res){
        Article.find({}).exec().then(foundArticles => {
            res.send(foundArticles);
        }).catch(err => {
            console.error(err);
        });
    })
    .post(function(req, res){
        const newArticle = new Article ({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save().then(() => {
            res.redirect("/articles");
            });
    })
    .delete(function(req, res){
        Article.deleteMany({}).exec().then(deleteAllArticles => {
            res.send("successful");
        }).catch(err => {
            console.error(err);
        });
    });


    
///////////////////////Requests Targeting A Specific Articles////////////////////

app.route("/articles/:articleTitle")

    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle}).exec().then(foundArticle => {
            if (foundArticle){
                res.send(foundArticle);
            } else{
                res.send("Not found");
            }
        }).catch(err => {
            console.error(err);
        });
    })
    .put(function(req, res){
        Article.findOneAndUpdate({title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            { new: true })
            .exec().then(updateArticle => {
            if (updateArticle){
                res.send(updateArticle);
            } else{
                res.send("Not able to update");
            }
        }).catch(err => {
            console.error(err);
        });
    })
    .patch(function(req, res){
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {$set: req.body})
            .exec().then(updateArticle => {
            if (updateArticle){
                res.send(updateArticle);
            } else{
                res.send("Not able to update");
            }
        }).catch(err => {
            console.error(err);
        });
    })
    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle}
        ).exec().then(deleteSpecificArticle => {
            res.send(deleteSpecificArticle);
        }).catch(err => {
            console.error(err);
        });
    });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});