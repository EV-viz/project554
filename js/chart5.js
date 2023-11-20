Promise.all([d3.json("./data/us.json"), d3.csv("./data/une.csv")]).then(
  ([json, inputData]) => {
    var svg = d3.select("#mapcontainer"),
      width = +svg.attr("width"),
      height = +svg.attr("height");
    svg.style("background-color", "lightblue");

    var index = 47; // manually set index of State in FeatureCollection features

    var colors = { fg: d3.color("black"), bg: d3.color("whitesmoke") };

    var projection = d3
      .geoAlbersUsa()
      .fitSize([width, height], json.features[index]);

    var path = d3.geoPath().projection(projection);

    var d = path(json.features[index]);

    svg
      .append("path")
      .attr("fill", colors.bg)
      .attr("stroke", colors.bg.darker())
      .attr("d", d);

    var p1 = {
      text: "info1",
      lat: 47.5213463,
      lon: -121.9042972,
      point: [-121.9042972, 47.5213463],
    }; // lon, lat
    var p2 = {
      text: "info2",
      lat: 47.5918463,
      lon: -121.8334972,
      point: [-121.8334972, 47.5918463],
    }; // lon, lat

    var data = [p1, p2];

    // Append circles for each point in the data array
    svg
      .selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("fill", colors.fg)
      .attr("stroke", colors.fg.darker())
      .attr("cx", (d) => projection([d.lon, d.lat])[0])
      .attr("cy", (d) => projection([d.lon, d.lat])[1])
      .attr("r", 5)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 8).attr("fill", "red");

        svg
          .datum(d)
          .enter()
          .append("title")
          .attr("class", "tooltip")
          .attr("x", projection([d.lon, d.lat])[0] + 10)
          .attr("y", projection([d.lon, d.lat])[1] + 10) // Position the tooltip text slightly above the circle
          .style("z-index", "10")
          .text((d) => d.text)
          .style("font-size", "12px");
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("r", 5).attr("fill", colors.fg);
        svg.selectAll(".tooltip").remove();
      });
  }
);
