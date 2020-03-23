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
  var tweets = mood.get_tweets_and_sentiment(req.body.city, req.body.state);
  console.log(`RETREIVED: ${tweets}`);
  res.render("tweets", { title: "TWITTER MOOD", tweets: tweets });
});
module.exports = router;
