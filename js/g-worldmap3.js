Promise.all([
  d3.json("./data/countries-10m.json"),
  d3.json("./data/input.json"),
  d3.json("./data/capitals.geojson"),
]).then(([world, inputData, capitalCities]) => {
  var svg = d3.select("#svg4").style("background", "lightblue");

  const countryList = inputData.map((data) => {
    return data.country;
  });

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

  // Filter capital cities for the countries in your inputData
  const filteredCapitalCities = {
    type: "FeatureCollection",
    features: capitalCities.features.filter((city) =>
      countryList.includes(city.properties.country)
    ),
  };

  // Draw capital city dots
  svg
    .selectAll(".capital-city")
    .data(filteredCapitalCities.features)
    .enter()
    .append("circle")
    .attr("class", "capital-city")
    .attr("cx", (d) => projection(d.geometry.coordinates)[0])
    .attr("cy", (d) => projection(d.geometry.coordinates)[1])
    .attr("r", 5)
    .style("fill", "darkblue")
    .style("opacity", 0.7);

  svg
    .selectAll(".capital-city-label")
    .data(filteredCapitalCities.features)
    .enter()
    .append("text")
    .attr("class", "capital-city-label")
    .attr("x", (d) => {
      if (d.properties.country == "Malaysia") {
        return projection(d.geometry.coordinates)[0] + 10;
      }
      return projection(d.geometry.coordinates)[0] - 25;
    })
    .attr("y", (d) => {
      if (d.properties.country == "Malaysia") {
        return projection(d.geometry.coordinates)[1] - 10;
      }
      return projection(d.geometry.coordinates)[1] + 20;
    })
    .text((d) => d.properties.city)
    .style("font-size", "12px")
    .style("fill", "black");

  // Add a title to the top center
  svg
    .append("text")
    .text("Capital Cities")
    .attr("x", width / 2)
    .attr("y", 30)
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold");
});
