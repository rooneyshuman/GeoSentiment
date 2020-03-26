var express = require("express");
var router = express.Router();
var mood = require("../backend/city_tweet_mood");
var cities = require("../public/assets/pruned_cities");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "TWITTER MOOD",
  });
});

router.post("/mood", function (req, res) {
  mood
    .get_tweets_and_sentiment(req.body.coords, req.body.radius)
    .then((tweets) => {
      res.render("tweets", { title: "TWITTER MOOD", tweets: tweets });
    })
    .catch(); //TODO: Error handling
});

router.get("/cities", function (req, res) {
  res.header("Content-Type", "application/json");
  res.send(JSON.stringify(cities));
});

module.exports = router;
