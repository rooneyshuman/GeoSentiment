var express = require("express");
var router = express.Router();
var mood = require("../city_tweet_mood");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    title: "TWITTER MOOD"
  });
});

router.post("/mood", function(req, res) {
  mood
    .get_tweets_and_sentiment(req.body.city, req.body.state)
    .then(tweets => {
      res.render("tweets", { title: "TWITTER MOOD", tweets: tweets });
    })
    .catch(); //TODO: Error handling
});

module.exports = router;
