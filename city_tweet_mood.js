'use strict';
const path = require('path');
const process = require('process');
process.env.GOOGLE_APPLICATION_CREDENTIALS = process.cwd() + path.sep + 'google_sa.json';
const twitter_secrets = require('./twitter_keys');
const language = require('@google-cloud/language');
const Twitter = require('twitter');
const google_client = new language.LanguageServiceClient();
const twitter_client = new Twitter({
    consumer_key: twitter_secrets.TWITTER_API,
    consumer_secret: twitter_secrets.TWITTER_SECRET,
    access_token_key: twitter_secrets.TWITTER_ACCESS_TOKEN,
    access_token_secret: twitter_secrets.TWITTER_ACCESS_SECRET
});


/**
 * TODO - make a city -> coordinate database
 * @param city_name
 * @returns string of gps coordinates (lat,long)
 */
function get_city_coordinates(city_name) {
    // PLACEHOLDER FOR GETTING THE CITY COORDINATES VIA API
    return '45.523,-122.676';
}

/**
 * get_city_tweets
 * Finds some number of tweets and their associated text for the passed-in city
 * @param city_name - name of city to check
 * @param num_of_tweets - how many tweets to analyse
 * @returns an array of the tweet's text
 */
async function get_city_tweets(city_name, num_of_tweets) {
    const city_coordinate_info = get_city_coordinates(city_name);
    const search_params = {
        q: '',
        geocode: city_coordinate_info + ',2mi',
        lang: 'en',
        count: num_of_tweets,
        tweet_mode: 'extended'
    };
    let tweets = await twitter_client.get('search/tweets', search_params);
    return Promise.resolve(tweets.statuses.map(tweet => tweet.full_text));
}


async function sentiment_helper(doc) {
    let [result] = await google_client.analyzeSentiment({document: doc});
    return Promise.resolve(result.documentSentiment);
}


/**
 * get_sentiment
 * Runs google NLP sentiment analysis on a passed-in array of text asynchronously
 * @param text_arr - an array of tweet texts
 * @returns Object displaying the text and the sentiment dictionary { text: text, sentiment: {mag: float, score: float}}
 */
async function get_sentiment(text_arr) {
    return await Promise.all(text_arr.map(async text => {
        return {
            text: text,
            sentiment: await sentiment_helper({
                content: text,
                type: 'PLAIN_TEXT',
            })
        }
    }));
}

/**
 * get_tweets_and_sentiment
 * Given a city name, return the top x amount of tweets
 * @param city_name string - city to analyze
 * @returns Array of text -> sentiment objects
 */
async function get_tweets_and_sentiment(city_name) {
    await get_city_tweets("portland", 50)
        .then(async results => {
            let res = await get_sentiment(results);
            console.log(res); // TODO - refactor to just a return when using these actual values (not just testing)
            return res;
        })
        .catch(err => {
            console.error(err);
        })
}

// get_tweets_and_sentiment();  // TODO - UNCOMMENT TO TEST -- `$ node ./city_tweet_mood.js`

module.exports = {get_tweets_and_sentiment};