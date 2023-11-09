d3.csv("./data/input.csv").then((data) => {
  // set the dimensions and margins of the graph
  const margin = { top: 40, right: 30, bottom: 40, left: 40 },
    width = 450 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain([0, 80000]).range([0, width]);
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // y axis label
  svg
    .append("text")
    .attr("x", 3)
    .attr("y", 5)
    .text("Unemployment Rate")
    .style("font-size", "16px")
    .attr("transform", "translate(-30, 150) rotate(270)");

  // x axis label
  svg
    .append("text")
    .attr("x", width - 100)
    .attr("y", height)
    .style("font-size", "16px")
    .text("GDP Per Capita")
    .attr("transform", "translate(0, 30)");

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 20]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Add dots
  svg
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(d.gdpPercap))
    .attr("cy", (d) => y(d.unemp))
    .attr("r", 10)
    .style("fill", (d) => {
      if (d.gdpPercap < 30000) {
        return "orange";
      }
      return "darkblue";
    })

    .attr("stroke", "none");

  // Append country labels with a specific class
  svg
    .append("g")
    .selectAll(".country-label") // Use a specific class for the country labels
    .data(data)
    .enter()
    .append("text")
    .attr("class", "country-label")
    .attr("x", (d) => x(d.gdpPercap))
    .attr("y", (d) => y(d.unemp) - 10)
    .text((d) => d.country)
    .attr("text-anchor", "middle")
    .style("font-size", "13px");
  // title
  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .text("GDP Per Capita vs Unemployment Rate");
});
