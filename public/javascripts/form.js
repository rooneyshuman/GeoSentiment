function get_cities() {
  $("#state_select").change(function() {
    var in_state;
    $.ajax({
      type: "GET",
      url: "../cities.json",
      success: function(cities) {
        in_state = cities.filter(data =>
          data.state.match($("#state_select").val())
        );
        $("#city_select").empty();
        $("#city_select").append(
          '<option value="" selected disabled>City</option>'
        );
        in_state.forEach(element => {
          $("#city_select").append(
            `<option value="${element.city}">${element.city}</option>`
          );
        });
      }
    });
    $("#city_row").show();
  });
}

get_cities();
