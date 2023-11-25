async function loadData() {
  try {
    const data = await d3.csv("../data/timeStack1.csv");

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
  } catch (error) {
    // Handle error appropriately
    console.error("Error loading data:", error);
  }
}

// Call the async function to load and process the data
loadData();
