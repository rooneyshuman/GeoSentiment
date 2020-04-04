"use strict";
const sqlite3 = require("sqlite3").verbose();
const sql_q = require("./db_sql_qs");
const cities = require("../public/assets/pruned_cities");

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

  _get_date_hour() {
    let date_obj = new Date();
    let date_str =
      date_obj.getFullYear() +
      "-" +
      (date_obj.getMonth() + 1) +
      "-" +
      date_obj.getDate();
    let hour = date_obj.getHours();
    return [date_str, hour];
  }

  insert_tweet(city, content, magnitude, sentiment) {
    // assume check has already been done for this hour
    let [date_str, hour] = this._get_date_hour();
    let city_id, tweet_id;
    this._db_conn.serialize(() => {
      let get_city_statement = this._db_conn.prepare(sql_q.get_city_id);
      get_city_statement.get(city, (err, result) => {
        city_id = result.id;
      });
      get_city_statement.finalize();
      let insert_tweet_statement = this._db_conn.prepare(sql_q.insert_tweet);
      insert_tweet_statement.run(content, magnitude, sentiment);
      insert_tweet_statement.finalize();
      this._db_conn.get("SELECT last_insert_rowid() as id;", (err, row) => {
        console.log(row.id);
        tweet_id = row.id;
        let insert_tweet_rel_statement = this._db_conn.prepare(
          sql_q.insert_tweet_rel
        );
        insert_tweet_rel_statement.run(city_id, tweet_id, date_str, hour);
        insert_tweet_rel_statement.finalize();
      });
    });
  }
}

module.exports = {
  db: db,
};
