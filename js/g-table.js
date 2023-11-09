d3.csv("./data/input.csv").then((data) => {
  // Extract the headers from the first row of the CSV data, excluding "CountryCode"
  const headers = ["Country", "Population", "Unemployment", "GDP"];

  // Select the table headers and add them
  d3.select("#table thead tr")
    .selectAll("th")
    .data(headers)
    .enter()
    .append("th")
    .text((d) => d);

  // Select the table body and add the rows
  const rows = d3
    .select("#table tbody")
    .selectAll("tr")
    .data(data)
    .enter()
    .append("tr");

  // Add cells to the rows and populate with data, excluding "CountryCode"
  rows
    .selectAll("td")
    .data((d) => Object.values(d).slice(1)) // Slice to exclude the first column
    .enter()
    .append("td")
    .text((d) => d);
});
