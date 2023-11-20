// Load the GeoJSON data and the EV data
Promise.all([
    d3.json("../data/washington-state-counties.geojson"),  // Replace with the correct path to your GeoJSON file
    d3.csv("../data/EV_Population.csv")                          // Replace with the correct path to your CSV file
]).then(function(data) {
    let countiesGeoJson = data[0];
    let evData = data[1];

    // Aggregate the EV data to count EVs per county
    let evCountPerCounty = evData.reduce(function (acc, row) {
        acc[row.County] = (acc[row.County] || 0) + 1;
        return acc;
    }, {});

    // Set up the SVG
    let margin = { top: 10, right: 10, bottom: 10, left: 10 };
    let width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    let svg = d3.select("#choroplethMap")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up a color scale
    let colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateBlues)
        .domain([0, d3.max(Object.values(evCountPerCounty))]);

    // Define a projection
    let projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2])
        .scale([1000]);

    // Draw each county
    svg.selectAll(".county")
        .data(countiesGeoJson.features)
        .enter().append("path")
        .attr("class", "county")
        .attr("d", d3.geoPath().projection(projection))
        .style("fill", function(d) {
            // Use the county name to get the EV count, and then the color
            let countyName = d.properties.name; // Replace 'name' with the actual property name in your GeoJSON
            let count = evCountPerCounty[countyName] || 0;
            return colorScale(count);
        })
        .style("stroke", "#fff")
        .style("stroke-width", "1");

    // Additional code for tooltips, legends, etc., can be added here
});
