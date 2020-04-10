const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;
const rewire = require("rewire");
const city_mood = rewire("../backend/city_tweet_mood.js");

describe("Get Sentiment w/ Valid Text", () => {
  const get_sentiment = city_mood.__get__("get_sentiment");
  let text_to_analyze = ["positive", "negative", "neutral"];
  let results = get_sentiment(text_to_analyze);

  it("Should have basic length and data characteristics", () => {
    expect(results).to.be.an("array");
    expect(results).to.be.length(3);
    results.forEach((sentiment) => {
      expect(sentiment).to.be.an("object");
      expect(sentiment.content).to.be.a("string");
      expect(sentiment.score).to.be.a("number");
      expect(sentiment.positive).to.be.a("number");
      expect(sentiment.negative).to.be.a("number");
      expect(sentiment.neutral).to.be.a("number");
    });
  });
});
