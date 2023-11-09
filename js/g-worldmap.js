Promise.all([
  d3.json("./data/countries-10m.json"),
  d3.json("./data/input.json"),
]).then(([world, inputData]) => {
  var svg = d3.select("#svg2").style("background", "lightblue");

  var feature = topojson.feature(world, world.objects.countries);
  feature.features = feature.features.filter((d) => d.id != "462"); //filter out Maldives (id=462)

  var height = 500;
  var width = 680;

  var projection = d3.geoEquirectangular().fitSize([width, height], feature);
  var path = d3.geoPath().projection(projection);

  svg
    .append("g")
    .selectAll("path")
    .data(feature.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "countries")
    .attr("id", (d) => `${d.properties.name} (id='${d.id}')`)
    .style("fill", "whitesmoke");

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

  // Proportional Symbol Map
  var maxPopulation = d3.max(inputData, (d) => d.gdpPercap);

  var populationScale = d3
    .scaleSqrt()
    .domain([0, maxPopulation])
    .range([0, 20]); // Adjust the range for symbol size

  svg
    .selectAll(".proportional-symbol")
    .data(inputData)
    .enter()
    .append("circle")
    .attr("class", "proportional-symbol")
    .attr("cx", (d) => {
      var countryCode = d.Code;
      var countryFeature = feature.features.find(
        (country) => country.id == countryCode
      );
      if (countryFeature) {
        return path.centroid(countryFeature)[0];
      } else {
        return 0; // Handle cases where the country code is not found
      }
    })
    .attr("cy", (d) => {
      var countryCode = d.Code;
      var countryFeature = feature.features.find(
        (country) => country.id == countryCode
      );
      if (countryFeature) {
        return path.centroid(countryFeature)[1];
      } else {
        return 0; // Handle cases where the country code is not found
      }
    })
    .attr("r", (d) => populationScale(d.gdpPercap))
    .style("fill", "purple")
    .style("opacity", 0.5);

  // ================ proportional  ================
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
        return path.centroid(countryFeature)[0] - 30; // Adjust the distance from the circle
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
        return path.centroid(countryFeature)[1] + 25;
      } else {
        return 0; // Handle cases where the country code is not found
      }
    })
    .style("font-size", "12px");

  // Add a title to the top center
  svg
    .append("text")
    .text("GDP Per Capita")
    .attr("x", width / 2)
    .attr("y", 30)
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold");
});
