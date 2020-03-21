'use strict';
const twitter_secrets = require('./twitter_keys');
const Twitter = require('twitter');
const client = new Twitter({
    consumer_key: twitter_secrets.TWITTER_API,
    consumer_secret: twitter_secrets.TWITTER_SECRET,
    access_token_key: twitter_secrets.TWITTER_ACCESS_TOKEN,
    access_token_secret: twitter_secrets.TWITTER_ACCESS_SECRET
});


function get_city_coordinates(city_name) {
    // PLACEHOLDER FOR GETTING THE CITY COORDINATES VIA API
    return '45.523,-122.676';
}


function get_city_tweets(city_name) {
    const city_coordinate_info = get_city_coordinates(city_name);
    const search_params = {
        q: '',
        geocode: city_coordinate_info + ',2mi',
        lang: 'en',
        count: 100
    };

    client.get('search/tweets', search_params, (error, tweets, response) => {
        tweets.statuses.forEach(tweet => {
            console.log(tweet.user.screen_name + " says: " + tweet.text);
        });
    });
}

module.exports = {get_city_tweets};