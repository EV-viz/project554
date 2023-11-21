Promise.all([
  d3.json(
    "/data/united_states_washington_administrative_boundaries_level6_counties_polygon.geojson"
  ),
  d3.csv("/data/test.csv"),
]).then(([data, csvData]) => {
  // Initialize D3 projection
  const projection = d3
    .geoMercator()
    .center([-120.7401, 47.7511]) // Centered on Washington state
    .scale(5000)
    .translate([480, 300]); // SVG width and height / 2

  // Create the path generator
  const path = d3.geoPath().projection(projection);

  // Append an SVG element to the body
  const svg = d3.select("#map");

  // Append path for the map background
  svg
    .append("path")
    .datum(data)
    .attr("d", path)
    .style("fill", "white") // Set the fill color for the map background
    .style("stroke", "black")
    .style("stroke-width", "1px");

  // Append paths for county boundaries
  svg
    .selectAll(".boundary")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "boundary")
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", "1px");
});
