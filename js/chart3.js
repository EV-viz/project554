// Load the CSV data
d3.csv("./data/cleaned_population.csv").then(function (data) {
  // Extract the "Electric Vehicle Type" column for analysis
  var electricVehicleTypes = d3.group(data, (d) => d["Electric Vehicle Type"]);

  // Calculate the total count of electric vehicle types
  var totalCount = d3.sum(electricVehicleTypes, (d) => d[1].length);

  // Calculate the percentages for each electric vehicle type
  var percentages = Array.from(electricVehicleTypes, ([type, entries]) => ({
    type: type,
    count: entries.length,
    percentage: (entries.length / totalCount) * 100,
  }));

  // Create a pie chart using D3.js
  var width = 600;
  var height = 400;
  var marginBottom = 60; // Increased margin for the legend
  var radius = Math.min(width, height) / 2;

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var svg = d3
    .select("#pie-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height + marginBottom);

  var g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); // Center the pie chart

  var arc = d3.arc().innerRadius(0).outerRadius(radius);

  var pie = d3.pie().value(function (d) {
    return d.percentage;
  });

  var arcs = g
    .selectAll("arc")
    .data(pie(percentages))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", function (d, i) {
      return color(i);
    });

  // Add percentages as text labels on top of the pie
  arcs
    .append("text")
    .attr("transform", function (d) {
      var pos = arc.centroid(d);
      return "translate(" + pos + ")";
    })
    .text(function (d) {
      return d.data.percentage.toFixed(2) + "%";
    })
    .style("text-anchor", "middle")
    .style("font-size", "17px")
    .style("font-weight", "bold");

  // Add a legend at the bottom of the pie
  var legend = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height + 20) + ")"); // Adjust the legend position

  legend
    .selectAll(".legend-item")
    .data(percentages)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", function (d, i) {
      return "translate(0, " + i * 20 + ")"; // Display vertically with 20px spacing
    });

  legend
    .selectAll(".legend-item")
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function (d, i) {
      return color(i);
    });

  legend
    .selectAll(".legend-item")
    .append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text(function (d) {
      return d.type;
    });
});
