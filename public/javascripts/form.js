var cities;

// Retrieve city data from JSON file
$(function () {
  cities = $.ajax({
    type: "GET",
    url: "../cities",
    async: false,
  }).responseJSON;
});

// Filter cities matching state input and populate city dropdown
$(function () {
  $("#state_select").change(function () {
    const in_state = cities.filter((data) =>
      data.state.match($("#state_select").val())
    );
    $("#city_select").empty();
    $("#city_select").append(
      '<option value="" selected disabled>City</option>'
    );
    in_state.forEach((element) => {
      $("#city_select").append(
        `<option value="${element.city}">${element.city}</option>`
      );
    });
    $("#city_row").show();
  });
});

// Find city matching user input and populate coordinates field
$(function () {
  $("#city_select").change(function () {
    const city = cities.find(
      (data) =>
        data.state.match($("#state_select").val()) &&
        data.city.match($("#city_select").val())
    );
    $("#coords_input").val(
      city.latitude.toString() + "," + city.longitude.toString()
    );
    $("#radius_row").show();
  });
});
