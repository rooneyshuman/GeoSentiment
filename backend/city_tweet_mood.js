"use strict";
const path = require("path");
const process = require("process");
process.env.GOOGLE_APPLICATION_CREDENTIALS =
  process.cwd() + path.sep + "secrets" + path.sep + "google_sa.json";
const twitter_secrets = require("../secrets/twitter_keys");
const language = require("@google-cloud/language");
const Twitter = require("twitter");
// const google_client = new language.LanguageServiceClient();
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
 * @param num_of_tweets - how many tweets to analyse
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
  return Promise.resolve(tweets.statuses.map((tweet) => tweet.full_text));
}

/**
 * get_sentiment
 * Runs google NLP sentiment analysis on a passed-in array of text asynchronously
 * @param text_arr - an array of tweet texts
 * @returns Object displaying the text and the sentiment dictionary { text: text, sentiment: {mag: float, score: float}}
 */
function get_sentiment(text_arr) {
  let response_arr = [];
  text_arr.forEach((tweet) => {
    let intensity = vader.SentimentIntensityAnalyzer.polarity_scores(tweet);
    response_arr.push({
      content: tweet,
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
  return get_sentiment(tweet_arr);
}

module.exports = {
  get_tweets_and_sentiment: get_tweets_and_sentiment,
};
