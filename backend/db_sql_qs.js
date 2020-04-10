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
    minute INTEGER,
    FOREIGN KEY(city_id) REFERENCES cities(id),
    FOREIGN KEY(tweet_id) REFERENCES tweets(id),
    PRIMARY KEY(city_id, tweet_id)
    );`;

const tweets = `CREATE TABLE IF NOT EXISTS tweets
    (
    id INTEGER PRIMARY KEY, 
    content TEXT,
    score TEXT,
    positive REAL,
    negative REAL,
    neutral REAL
    );`;

const insert_cities = `
    INSERT INTO cities
    (city, state, latitude, longitude)
    VALUES
    (?, ?, ?, ?);
`;

const get_city_id = `
    SELECT id FROM cities
    WHERE city = (?)
    AND state = (?);
`;

const insert_tweet = `
    INSERT INTO tweets
    (content, score, positive, negative, neutral)
    VALUES
    (?, ?, ?, ?, ?);
`;

const insert_tweet_rel = `
    INSERT INTO city_tweets
    (city_id, tweet_id, date, hour, minute)
    VALUES
    (?, ?, ?, ?, ?);
`;

const get_current_city_tweets = `
    SELECT c.city, t.content, t.score, t.positive, t.negative, t.neutral
    FROM cities AS c
    INNER JOIN city_tweets AS ct ON c.id = ct.city_id
    INNER JOIN tweets AS t ON ct.tweet_id = t.id
    WHERE c.city = (?)
    AND c.state = (?)
    AND ct.date = (?)
    AND ct.hour = (?);
`;

const is_current = `
    SELECT COUNT(*)
    FROM cities AS c
    INNER JOIN city_tweets AS ct ON c.id = ct.city_id
    WHERE c.city = (?)
    AND c.state = (?)
    AND ct.date = (?)
    AND ct.hour = (?)
    AND ct.minute = (?);
`;

module.exports = {
  city_table: city_table,
  city_tweet_table: city_tweet_table,
  tweets: tweets,
  insert_cities: insert_cities,
  get_city_id: get_city_id,
  insert_tweet: insert_tweet,
  insert_tweet_rel: insert_tweet_rel,
  get_current_city_tweets: get_current_city_tweets,
  is_current: is_current,
};
