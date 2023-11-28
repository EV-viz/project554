// Load CSV data
d3.csv("./data/EV_Population_TimeSeries_EVType.csv")
  .then((data) => {
    // ========= chart 1:  EV  ===================
    // Data processing
    const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach((d) => {
      d.date = parseDate(d.Date);
      d.evPopulation = +d["Electric Vehicle (EV) Total"];
      d.nonev = +d["Total Vehicles"] - d.evPopulation;
    });

    // Set up chart dimensions
    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .nice()
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.evPopulation))])
      .nice()
      .range([height, 0]);

    // Create line functions
    const evLine = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.evPopulation));

    // Create SVG container for EV chart
    const evChart = d3
      .select("#ev-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw EV population line
    evChart
      .append("path")
      .datum(data)
      .attr("class", "ev-line")
      .attr("d", evLine)
      .style("stroke", "lightgreen");

    // Add x and y axes for EV chart
    const evXAxis = d3.axisBottom(xScale);
    const evYAxis = d3.axisLeft(yScale);

    evChart
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(evXAxis);

    evChart.append("g").attr("class", "y-axis").call(evYAxis);

    // Draw dots for each data point
    evChart
      .selectAll(".dot") // Select or create a class for the dots
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot") // Assign a class to the dots for styling
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.evPopulation))
      .attr("r", 2)
      .style("fill", "darkgreen"); // Set the radius of the dots

    // Add axis labels and title for EV chart
    // X-axis label
    evChart
      .append("text")
      .attr(
        "transform",
        `translate(${width - 10},${height + margin.bottom - 10})`
      )
      .style("text-anchor", "middle")
      .text("Date");

    // Y-axis label
    evChart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("EV Population");

    // Chart title
    evChart
      .append("text")
      .attr("class", "chart-title")
      .attr("transform", `translate(${width / 2}, ${-margin.top / 2})`)
      .style("text-anchor", "middle")
      .text("Electric Vehicle Population Over Time");

    // ========= chart 2 : All Vehicles  ===================

    const yScale2 = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => Math.min(d.nonev)),
        d3.max(data, (d) => Math.max(d.nonev)),
      ])
      .nice()
      .range([height, 0]);
    // Create SVG container for non-EV chart
    const nonEvChart = d3
      .select("#non-ev-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    // line for second chart
    const nonEvLine = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale2(d.nonev));

    // Draw non-EV population line
    nonEvChart
      .append("path")
      .datum(data)
      .attr("class", "non-ev-line")
      .attr("d", nonEvLine)
      .style("stroke", "lightblue");

    // Draw dots for each data point in non-EV
    nonEvChart
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale2(d.nonev))
      .attr("r", 3)
      .style("fill", "darkblue"); // Set the radius of the dots")

    // Add x and y axes for EV chart
    const evXAxis2 = d3.axisBottom(xScale);
    const evYAxis2 = d3.axisLeft(yScale2);

    nonEvChart
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(evXAxis2);

    nonEvChart.append("g").attr("class", "y-axis").call(evYAxis2);

    // Add axis labels and title for EV chart
    // X-axis label
    nonEvChart
      .append("text")
      .attr(
        "transform",
        `translate(${width - 10},${height + margin.bottom - 10})`
      )
      .style("text-anchor", "middle")
      .text("Date");

    // Y-axis label
    nonEvChart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Non-EV Population");

    // Chart title
    nonEvChart
      .append("text")
      .attr("class", "chart-title")
      .attr("transform", `translate(${width / 2}, ${-margin.top / 2})`)
      .style("text-anchor", "middle")
      .text("Non-EV Population Over Time");
  })
  .catch((error) => console.log("Error loading data:", error));
