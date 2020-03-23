var express = require("express");
var router = express.Router();
var mood = require("../city_tweet_mood");

/* GET home page. */
router.get("/", function(req, res, next) {
  mood.get_tweets_and_sentiment("Portland");
  res.render("index", {
    title: "Express"
  });
});

module.exports = router;
