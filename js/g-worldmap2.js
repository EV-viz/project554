Promise.all([
  d3.json("./data/countries-10m.json"),
  d3.json("./data/input.json"),
]).then(([world, inputData]) => {
  var svg = d3.select("#svg3").style("background", "lightblue");

  var feature = topojson.feature(world, world.objects.countries);
  feature.features = feature.features.filter((d) => d.id != "462"); //filter out Maldives (id=462)

  var height = 500;
  var width = 680;

  var projection = d3.geoEquirectangular().fitSize([width, height], feature);
  var path = d3.geoPath().projection(projection);
  // ================ choropleth ================
  // Define a color scale for unemployment rates
  var colorScale = d3
    .scaleSequential(d3.interpolateReds)
    .domain([0, d3.max(inputData, (d) => d.unemp)]);

  // Create a function to calculate the color for each country based on its unemployment rate
  function getColorByUnemploymentRate(countryId) {
    var countryData = inputData.find((item) => item.Code == countryId);
    return countryData ? colorScale(countryData.unemp) : "whitesmoke"; // Fallback to white if no data
  }

  svg
    .append("g")
    .selectAll("path")
    .data(feature.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "countries")
    .attr("id", (d) => `${d.properties.name} (id='${d.id}')`)
    .style("fill", (d) => getColorByUnemploymentRate(d.id));

  svg
    .append("path") // countries boundaries
    .attr("class", "countries-borders")
    .attr(
      "d",
      path(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
    )
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", "0.5px")
    .style("stroke-linejoin", "round")
    .style("stroke-linecap", "round")
    .style("pointer-events", "none");

  // Define a color scale for the legend
  var legendColorScale = d3
    .scaleSequential(d3.interpolateReds)
    .domain([0, d3.max(inputData, (d) => d.unemp)]);

  // Create a group element for the legend and position it in the top-right corner
  var legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20, 230)"); // Adjust the position as needed

  // Create rectangles in the legend to represent the color scale
  legend
    .selectAll("rect")
    .data(legendColorScale.ticks(6)) // You can adjust the number of legend entries
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * 20)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", (d) => legendColorScale(d));

  // Add labels to the legend
  legend
    .selectAll("text")
    .data(legendColorScale.ticks(7))
    .enter()
    .append("text")
    .text((d) => d.toFixed(1))
    .attr("x", 30)
    .attr("y", (d, i) => i * 20 + 12)
    .style("font-size", "12px");

  svg
    .selectAll(".country-label") // Use a different class for the text elements
    .data(inputData)
    .enter()
    .append("text")
    .text((d) => d.country)
    .attr("x", (d) => {
      var countryCode = d.Code;
      var countryFeature = feature.features.find(
        (country) => country.id == countryCode
      );
      if (d.country == "Malaysia") {
        return path.centroid(countryFeature)[0] + 10;
      }
      if (countryFeature) {
        return path.centroid(countryFeature)[0] - 35; // Adjust the distance from the circle
      } else {
        return 0; // Handle cases where the country code is not found
      }
    })
    .attr("y", (d) => {
      var countryCode = d.Code;
      var countryFeature = feature.features.find(
        (country) => country.id == countryCode
      );
      if (d.country == "Malaysia") {
        return path.centroid(countryFeature)[1];
      }
      if (countryFeature) {
        return path.centroid(countryFeature)[1] + 15;
      } else {
        return 0; // Handle cases where the country code is not found
      }
    })
    .style("font-size", "12px");

  // Add a title to the top center
  svg
    .append("text")
    .text("Unemployment Rate")
    .attr("x", width / 2)
    .attr("y", 30)
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold");
});
