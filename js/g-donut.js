// Load the JSON data
d3.json("./data/input.json").then((data) => {
  // Select the SVG container
  var svg = d3.select("#piechart"),
    width = +svg.attr("width"),
    height = +svg.attr("height") - 20,
    radius = Math.min(width, height) / 2,
    g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2 + 20})`);

  var color = d3.scaleOrdinal(d3.schemeCategory10.slice(1));

  var pie = d3
    .pie()
    .value((d) => d.pop)
    .sort(null)
    .sortValues(d3.descending);

  var path = d3.arc().outerRadius(radius).innerRadius(0);

  var outerArc = d3
    .arc()
    .outerRadius(radius - 50)
    .innerRadius(radius - 50);

  var arc = g
    .selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  arc
    .append("path")
    .attr("d", path)
    .attr("fill", (d, i) => color(i));

  arc
    .append("text")
    .attr("transform", (d) => `translate(${outerArc.centroid(d)})`)
    .text((d) => `${d.data.pop} `)
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "black");

  // Add a legend
  var legend = svg.append("g").attr("transform", `translate(${width - 80},-1)`);

  var legendItems = data.map((d) => d.country);
  var legendColors = data.map((d, i) => color(i));

  legend
    .selectAll(".legend-item")
    .data(legendItems)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

  legend
    .selectAll(".legend-item")
    .append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", (d, i) => legendColors[i]);

  legend
    .selectAll(".legend-item")
    .append("text")
    .attr("x", 20)
    .attr("y", 10)
    .text((d) => d)
    .style("font-size", "12px");

  // title
  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("Population");
});
