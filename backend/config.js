const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  twitter_api: process.env.TWITTER_API,
  twitter_secret: process.env.TWITTER_SECRET,
};
