// d3.csv("../data/groupedData.csv").then((data) => {
//   // Data processing
//   data.forEach(d => {
//     d["Electric Vehicle (EV) Total"] = +d["Electric Vehicle (EV) Total"];
//     d["Non-Electric Vehicle Total"] = +d["Non-Electric Vehicle Total"];
//     d.Year = +d.Year; // Ensure the Year is a number
//   });

//   let categories = ["Electric Vehicle (EV) Total", "Non-Electric Vehicle Total"];

//   // Define margins, width, and height
//   let margin = { top: 40, right: 20, bottom: 25, left: 50 };
//   let width = 600 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

//   // Create scales
//   let x0 = d3.scaleBand()
//     .domain(data.map(d => d.Year))
//     .rangeRound([0, width])
//     .paddingInner(0.1);

//   let x1 = d3.scaleBand()
//     .domain(categories)
//     .rangeRound([0, x0.bandwidth()])
//     .padding(0.05);

//   let y = d3.scaleLinear()
//     .domain([0, d3.max(data, d => Math.max(d["Electric Vehicle (EV) Total"], d["Non-Electric Vehicle Total"]))])
//     .range([height, 0]);

//   // Create axes
//   let xAxis = d3.axisBottom(x0);
//   let yAxis = d3.axisLeft(y).tickFormat(d3.format(".2s"));

//   // Create SVG container
//   let svg = d3.select("#barchartvv")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   // Draw the bars
//   let yearGroup = svg.selectAll(".yearGroup")
//     .data(data)
//     .enter().append("g")
//     .attr("class", "yearGroup")
//     .attr("transform", d => `translate(${x0(d.Year)},0)`);

//   yearGroup.selectAll("rect")
//     .data(d => categories.map(key => ({ key: key, value: d[key] })))
//     .enter().append("rect")
//     .attr("x", d => x1(d.key))
//     .attr("y", d => y(d.value))
//     .attr("width", x1.bandwidth())
//     .attr("height", d => height - y(d.value))
//     .attr("fill", d => d.key === "Electric Vehicle (EV) Total" ? "green" : "blue");

//   // Append axes to the SVG
//   svg.append("g")
//     .attr("transform", `translate(0,${height})`)
//     .call(xAxis);

//   svg.append("g")
//     .call(yAxis);

//   // Chart Title
//   svg.append("text")
//     .attr("class", "chart-title")
//     .attr("x", width / 2)
//     .attr("y", 0 - margin.top / 2)
//     .attr("text-anchor", "middle")
//     .style("font-size", "16px")
//     .style("font-weight", "bold")
//     .text("Electric and Non-Electric Vehicle Totals by Year");

//   // Y-Axis Label
//   svg.append("text")
//     .attr("class", "y-label")
//     .attr("transform", "rotate(-90)")
//     .attr("x", 0 - height / 2)
//     .attr("y", 0 - margin.left)
//     .attr("dy", "1em")
//     .style("text-anchor", "middle")
//     .text("Vehicle Count");

//     let legendData = [
//       { label: "EV", color: "green" },
//       { label: "Non-EV", color: "blue" }
//     ];

//     // Create Legend
//     let legend = svg.append("g")
//       .attr("class", "legend")
//       .attr("transform", `translate(${width - 50}, ${margin.top-30})`)
//       .selectAll("g")
//       .data(legendData)
//       .enter().append("g")
//       .attr("transform", (d, i) => `translate(0, ${i * 20})`);

//     // Draw Legend Rectangles
//     legend.append("rect")
//       .attr("x", 0)
//       .attr("width", 18)
//       .attr("height", 18)
//       .attr("fill", d => d.color);

//     // Draw Legend Text
//     legend.append("text")
//       .attr("x", 24)
//       .attr("y", 9)
//       .attr("dy", ".35em")
//       .text(d => d.label)
//       .style("font-size", "12px")
//       .attr("text-anchor", "start");
// });

d3.csv("../data/timeStack1.csv").then((data) => {
  // Data processing
  data.forEach((d) => {
    d["Battery Electric Vehicles (BEVs)"] =
      +d["Battery Electric Vehicles (BEVs)"];
    d["Plug-In Hybrid Electric Vehicles (PHEVs)"] =
      +d["Plug-In Hybrid Electric Vehicles (PHEVs)"];
  });

  let categories = [
    "Battery Electric Vehicles (BEVs)",
    "Plug-In Hybrid Electric Vehicles (PHEVs)",
  ];

  // Define margins, width, and height
  let margin = { top: 40, right: 150, bottom: 50, left: 60 };
  let width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Create scales
  let x = d3
    .scaleBand()
    .domain(data.map((d) => d.Date))
    .rangeRound([0, width])
    .paddingInner(0.1);

  let y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(
        data,
        (d) =>
          d["Battery Electric Vehicles (BEVs)"] +
          d["Plug-In Hybrid Electric Vehicles (PHEVs)"]
      ),
    ])
    .range([height, 0]);

  let color = d3
    .scaleOrdinal()
    .domain(categories)
    .range(["#1f77b4", "#ff7f0e"]);

  // Stack the data
  let stack = d3.stack().keys(categories)(data);

  // Create SVG container
  let svg = d3
    .select("#barchartvv")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Draw the stacked bars
  svg
    .append("g")
    .selectAll("g")
    .data(stack)
    .enter()
    .append("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.data.Date))
    .attr("y", (d) => y(d[1]))
    .attr("height", (d) => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth());

  // Append axes to the SVG
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

  svg.append("g").call(d3.axisLeft(y));

  // Chart Title
  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Registered EV by Type (2017-2023)");

  // Y-Axis Label
  svg
    .append("text")
    .attr("class", "y-label")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height / 2)
    .attr("y", 0 - margin.left)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Vehicle Count");

  let categoryAbbreviations = {
    "Battery Electric Vehicles (BEVs)": "BEVs",
    "Plug-In Hybrid Electric Vehicles (PHEVs)": "PHEVs",
  };

  // Create Legend
  let legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - 100}, ${margin.top - 30})`)
    .selectAll("g")
    .data(categories)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  // Draw Legend Rectangles
  legend
    .append("rect")
    .attr("x", 110)
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", color);

  // Draw Legend Text
  legend
    .append("text")
    .attr("x", 134)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text((d) => categoryAbbreviations[d]) // Use the abbreviation mapping here
    .style("font-size", "12px")
    .attr("text-anchor", "start");
});
