"use strict";
const twitter_secrets = require("../secrets/twitter_keys");
const Twitter = require("twitter");
const vader = require("vader-sentiment");
const twitter_client = new Twitter({
  consumer_key: twitter_secrets.TWITTER_API,
  consumer_secret: twitter_secrets.TWITTER_SECRET,
  access_token_key: twitter_secrets.TWITTER_ACCESS_TOKEN,
  access_token_secret: twitter_secrets.TWITTER_ACCESS_SECRET,
});
const NUM_OF_TWEETS = 100;

/**
 * get_city_tweets
 * Finds some number of tweets and their associated text for the passed-in city
 * @param coordinates string - coordinates of city to analyze
 * @returns an array of the tweet's text
 */
async function get_city_tweets(coordinates) {
  const search_params = {
    q: "",
    geocode: coordinates + ",5mi",
    lang: "en",
    count: NUM_OF_TWEETS,
    tweet_mode: "extended",
  };
  let tweets = await twitter_client.get("search/tweets", search_params);
  console.log(
    Promise.resolve(
      tweets.statuses.map((tweet) => ({
        text: tweet.full_text,
        date: tweet.created_at,
      }))
    )
  );
  return Promise.resolve(tweets.statuses.map((tweet) => tweet.full_text));
}

/**
 * get_sentiment
 * Runs vader sentiment analysis on a passed-in array of text
 * @param text_arr - an array of tweet texts
 * @returns Object displaying the text and the sentiment dictionary
 *            { text: text, score: float, positive: float, negative: float, neutral: float}
 */
function get_sentiment(tweet_arr) {
  let response_arr = [];
  tweet_arr.forEach((tweet) => {
    let intensity = vader.SentimentIntensityAnalyzer.polarity_scores(tweet.text);
    response_arr.push({
      content: tweet.text,
      date: tweet.date,
      score: intensity.compound,
      positive: intensity.pos,
      negative: intensity.neg,
      neutral: intensity.neu,
    });
  });
  return response_arr;
}

/**
 * get_tweets_and_sentiment
 * Given a city's coordinates, return the top x amount of tweets
 * @param coordinates string - coordinates of city to analyze
 * @returns Array of text -> sentiment objects
 */
async function get_tweets_and_sentiment(coordinates) {
  let tweet_arr = await get_city_tweets(coordinates);
  tweet_arr.forEach((element) => {
    const date = new Date(element.date);
    element.date =
      date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
  });
  return get_sentiment(tweet_arr);
}

module.exports = {
  get_tweets_and_sentiment: get_tweets_and_sentiment,
};
