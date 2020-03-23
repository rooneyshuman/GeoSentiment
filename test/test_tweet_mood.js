const chai = require("chai");
const assert = chai.assert;
const should = chai.should();
const city_mood = require("../backend/city_tweet_mood");

describe("Coordinates Retrieved by City/State Combo", () => {
  it("Should Return a String", () => {
    assert.equal(
      typeof city_mood._get_city_coordinates("Portland", "Oregon"),
      "string"
    );
  });

  it("Should Return Correctly for Portland, OR", () => {
    assert.equal(
      city_mood._get_city_coordinates("Portland", "Oregon"),
      "45.5230622,-122.6764816"
    );
  });
});
