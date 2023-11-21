// Create an SVG container

// Load both files using Promise.all
const washingtonGeoJSONPath =
  "/data/united_states_washington_administrative_boundaries_level6_counties_polygon.geojson";
const pointsDataPath = "/data/test.json";

Promise.all([d3.json(washingtonGeoJSONPath), d3.json(pointsDataPath)]).then(
  function ([geojsonData, jsonData]) {
    const svg = d3
      .select("#map-container")
      .append("svg")
      .attr("width", 960) // Adjust the width as needed
      .attr("height", 600); // Adjust the height as needed
    // Create a Mercator projection centered on Washington state
    const projection = d3
      .geoMercator()
      .center([-120.7401, 47.7511]) // Centered on Washington state
      .scale(5000) // Adjust the scale as needed
      .translate([480, 300]);

    // Create a path generator using the projection
    const path = d3.geoPath().projection(projection);

    // Append the GeoJSON data to the SVG as paths
    svg
      .selectAll("path")
      .data(geojsonData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", "none"); // Adjust the map's fill color
  }
);
