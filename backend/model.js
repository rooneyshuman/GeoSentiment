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
}

module.exports = {
  db: db,
};
