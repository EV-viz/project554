d3.json("../data/pop.json").then((data) => {
  data.sort((a, b) => b.pop - a.pop);
  let margin = { top: 40, right: 20, bottom: 25, left: 50 };
  let width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  let x = d3
    .scaleBand()
    .domain(data.map((d) => d.country)) //🚧
    .range([0, width])
    .padding(0.2)
    .paddingInner(0.4);

  let y = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((d) => d["pop"]))]) //🚧
    .range([height - 10, 0]);

  let xAxis = d3.axisBottom().scale(x);

  let yAxis = d3
    .axisLeft()
    .scale(y)
    .tickFormat(d3.format(".2s")) //🚧
    .ticks(6); //limit the number of tick marks on y axis

  let svg = d3
    .select("#barchartvv")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d["country"]))
    .attr("y", (d) => y(d["pop"]))
    .attr("width", x.bandwidth)
    .attr("height", (d) => height - y(d["pop"]))
    .style("fill", "orange");

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .style("font-size", "12px")
    .call(xAxis);

  svg.append("g").call(yAxis);

  // data label on bars
  svg
    .selectAll("myRect")
    .data(data)
    .enter()
    .append("text")
    .text((d) => d["pop"])
    .attr("x", (d) => x(d.country) + x.bandwidth() / 2) // Center the text on the bar
    .attr("y", (d) => y(d["pop"]) - 5) // Adjust the y-coordinate for proper placement
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("text-anchor", "middle")
    .style("alignment-baseline", "middle");

  svg
    .append("text")
    .attr("class", "y-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .style("text-anchor", "middle")
    .text("Population");

  // title
  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .text("Population");
});
