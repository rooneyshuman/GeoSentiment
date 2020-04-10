"use strict";
const sqlite3 = require("sqlite3").verbose();
const sql_q = require("./db_sql_qs");
const cities = require("../public/assets/pruned_cities");
const get_tweets_from_api = require("./city_tweet_mood")
  .get_tweets_and_sentiment;

class db {
  constructor() {
    this._db_name = "test.db";
    this._db_conn = new sqlite3.Database(this._db_name, (err) => {
      if (err != null) console.error(err);
    });
    this._init_setup();
  }

  _init_setup() {
    this._db_conn.serialize(() => {
      this._db_conn
        .run(sql_q.city_table)
        .run(sql_q.city_tweet_table)
        .run(sql_q.tweets, (err) => {
          if (err != null) {
            console.error("error in init setup");
            console.error(err);
          }
        });
    });
    this._db_conn.get("SELECT * FROM cities;", (err, rows) => {
      if (rows === undefined) {
        let city_statement = this._db_conn.prepare(sql_q.insert_cities);
        cities.forEach((city) => {
          city_statement.run(
            city.city,
            city.state,
            city.latitude,
            city.longitude
          );
        });
        city_statement.finalize();
      }
    });
  }

  close() {
    this._db_conn.close();
  }

  get name() {
    return this._db_name;
  }

  _get_date_hour_min() {
    let date_obj = new Date();
    let date_str =
      date_obj.getFullYear() +
      "-" +
      (date_obj.getMonth() + 1) +
      "-" +
      date_obj.getDate();
    let hour = date_obj.getHours();
    let minute = date_obj.getMinutes();
    return [date_str, hour, minute];
  }

  insert_tweet(city, state, content, score, positive, negative, neutral) {
    let [date_str, hour, minute] = this._get_date_hour_min();
    let city_id, tweet_id;
    this._db_conn.serialize(() => {
      let get_city_statement = this._db_conn.prepare(sql_q.get_city_id);
      get_city_statement.get(city, state, (err, result) => {
        city_id = result.id;
      });
      get_city_statement.finalize();
      let insert_tweet_statement = this._db_conn.prepare(sql_q.insert_tweet);
      insert_tweet_statement.run(content, score, positive, negative, neutral);
      insert_tweet_statement.finalize();
      this._db_conn.get("SELECT last_insert_rowid() as id;", (err, row) => {
        tweet_id = row.id;
        let insert_tweet_rel_statement = this._db_conn.prepare(
          sql_q.insert_tweet_rel
        );
        insert_tweet_rel_statement.run(
          city_id,
          tweet_id,
          date_str,
          hour,
          minute
        );
        insert_tweet_rel_statement.finalize();
      });
    });
  }

  get_current_tweets(city, state, coordinates, callback) {
    let [date_str, hour, minute] = this._get_date_hour_min();
    let current_statement = this._db_conn.prepare(sql_q.is_current);
    current_statement.get(
      city,
      state,
      date_str,
      hour,
      minute,
      (err, result) => {
        if (Object.values(result)[0] === 0) {
          console.log("reading from api"); // TODO - info (logging)
          get_tweets_from_api(coordinates).then((tweets) => {
            tweets.forEach((tweet) => {
              this.insert_tweet(
                city,
                state,
                tweet.content,
                tweet.score,
                tweet.positive,
                tweet.negative,
                tweet.neutral
              );
            });
            callback(tweets);
          });
        } else {
          console.log("reading from db"); // TODO - info (logging)
          this.get_current_tweets_from_db(city, state, callback);
        }
      }
    );
    current_statement.finalize();
  }

  get_current_tweets_from_db(city, state, callback) {
    let [date_str, hour] = this._get_date_hour_min();
    let get_cur_tweets_statement = this._db_conn.prepare(
      sql_q.get_current_city_tweets
    );
    get_cur_tweets_statement.all(city, state, date_str, hour, (err, rows) => {
      callback(rows);
    });
  }
}

module.exports = {
  db: db,
};
