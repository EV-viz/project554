Promise.all([d3.json("./data/us.json"), d3.csv("./data/une.csv")]).then(
  ([json, inputData]) => {
    var svg = d3.select("#mapcontainer"),
      width = +svg.attr("width"),
      height = +svg.attr("height");
    svg.style("background-color", "lightblue");

    var index = 47; //mannually set index of State in FeatureCollection features
    var capitalLonLat = [-121.9042972, 47.5913463]; // lon, lat
    var colors = { fg: d3.color("black"), bg: d3.color("whitesmoke") }; //https://en.wikipedia.org/wiki/List_of_U.S._state_colors#Alabama

    //manual set-up
    // var projection = d3.geoAlbersUsa()  //see https://d3js.org/d3-geo/conic#geoAlbersUsa
    //   .translate([width * 0.5, height * 0.5])
    //   .scale([1200]);

    //set-up using fitSize
    var projection = d3
      .geoAlbersUsa()
      .fitSize([width, height], json.features[index]);

    //project Alabama feature geometry coordinates
    json.features[index].geometry.coordinates[0].forEach((d) => projection(d));

    //create path generator and configure it with the projection see https://github.com/d3/d3-geo#geoPath
    var path = d3.geoPath().projection(projection);

    //create path generator and configure it with the projection see https://github.com/d3/d3-geo#geoPath
    var path = d3.geoPath().projection(projection);

    //project State feature
    var d = path(json.features[index]);

    //append projected path setting 'fill', 'stroke' and 'd'
    svg
      .append("path")
      .attr("fill", colors.bg)
      .attr("stroke", colors.bg.darker())
      .attr("d", d);

    //project capital city
    var capital = projection(capitalLonLat);

    //append circle and text for the state
    svg
      .append("circle")
      .attr("fill", colors.fg)
      .attr("stroke", colors.fg.darker())
      .attr("cx", capital[0])
      .attr("cy", capital[1])
      .attr("r", 5);

    svg
      .append("text")
      .attr("fill", colors.fg)
      .attr("x", capital[0] - 40)
      .attr("y", capital[1] - 15)
      .text("Seattle");
  }
);
