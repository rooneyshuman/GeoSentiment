"use strict";

const city_table = `CREATE TABLE IF NOT EXISTS cities
    (
    id INTEGER PRIMARY KEY,
    city TEXT, 
    state TEXT, 
    latitude TEXT,
    longitude TEXT
    );`;

const city_tweet_table = `CREATE TABLE IF NOT EXISTS city_tweets
    (
    city_id INTEGER,
    tweet_id INTEGER, 
    date TEXT,
    hour INTEGER,
    FOREIGN KEY(city_id) REFERENCES cities(id),
    FOREIGN KEY(tweet_id) REFERENCES tweets(id),
    PRIMARY KEY(city_id, tweet_id)
    );`;

const tweets = `CREATE TABLE IF NOT EXISTS tweets
    (
    id INTEGER PRIMARY KEY, 
    contents TEXT,
    magnitude TEXT,
    sentiment TEXT
    );`;

const insert_cities = `
    INSERT INTO cities
    (city, state, latitude, longitude)
    VALUES
    (?, ?, ?, ?);
`;

module.exports = {
  city_table: city_table,
  city_tweet_table: city_tweet_table,
  tweets: tweets,
  insert_cities: insert_cities,
};
