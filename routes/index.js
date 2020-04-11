const express = require("express");
const router = express.Router();
const cities = require("../public/assets/pruned_cities");
const model_db = require("../backend/model_db");
const db = new model_db.db();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "TWITTER MOOD",
  });
});

router.post("/mood", function (req, res) {
  db.get_current_tweets(
    req.body.city,
    req.body.state,
    req.body.coords,
    (tweets) => {
      res.render("tweets", { title: "TWITTER MOOD", tweets: tweets });
    }
  ); // TODO - error handling
});

router.get("/cities", function (req, res) {
  res.header("Content-Type", "application/json");
  res.send(JSON.stringify(cities));
});

module.exports = router;
