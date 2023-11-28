window.addEventListener("DOMContentLoaded", (event) => {
  fetch("./data/topc.csv")
    .then((response) => response.text())
    .then((csvData) => {
      const rows = csvData.split("\n").map((row) => row.split(","));

      const table = new simpleDatatables.DataTable("#datatablesSimple2", {
        data: {
          headings: rows[0], // Use the first row as headings
          data: rows.slice(1, 500), // Exclude the first row for data
        },
        searchable: true,
        perPage: 50,
      });
    })
    .catch((error) => console.error("Error fetching or parsing CSV:", error));
});

// Define the color scale
const colorScale = d3
  .scaleLinear()
  .domain([3, 800, 2000, 4000, 5000, 10000, 20000, 40000, 50000, 80637])
  .range([
    "hsl(24, 100%, 100%)",
    "hsl(200, 100%, 90%)",
    "hsl(200, 100%, 82%)",
    "hsl(200, 100%, 75%)",
    "hsl(200, 100%, 70%)",
    "hsl(200, 100%, 60%)",
    "hsl(200, 100%, 40%)",
    "hsl(200, 100%, 30%)",
    "hsl(200, 100%, 20%)",
    "hsl(200, 98%, 10%)",
  ]);

// Create a legend
const legend = d3
  .select("#legenddiv")
  .append("svg")
  .attr("class", "legend")
  .attr("width", 700)
  .attr("height", 100);

const legendWidth = 750;
const legendHeight = 20;

const legendScale = d3.scaleLinear().domain([0, 80637]).range([0, legendWidth]);

const legendAxis = d3
  .axisBottom(legendScale)
  .tickSize(8)
  .tickValues([0, 10000, 20000, 30000, 40000, 50000, 60000, 70000])
  .tickFormat(d3.format(""));

legend
  .append("g")
  .attr("class", "legendAxis")
  .attr("transform", `translate(2,45)`)
  .call(legendAxis);

// Create the color band
legend
  .selectAll(".colorRect")
  .data(d3.range(legendWidth))
  .enter()
  .append("rect")
  .attr("class", "colorRect")
  .attr("x", (d, i) => i)
  .attr("y", 15)
  .attr("width", 1)
  .attr("height", legendHeight)
  .style("fill", (d, i) => colorScale(legendScale.invert(i)))
  .style("stroke", "none");
