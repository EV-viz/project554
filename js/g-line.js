// Load the data
d3.csv("./data/line.csv").then(function (data) {
  // Set up the SVG dimensions and margins
  var margin = { top: 40, right: 20, bottom: 40, left: 60 },
    width = 450 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var svg = d3
    .select("#linechart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Parse the date and GDP values
  var parseTime = d3.timeParse("%Y");
  data.forEach(function (d) {
    d.date = parseTime(d.year);
    d.gdp = +d.gdp;
  });

  // Get a list of unique countries for the legend
  var countries = [
    ...new Set(
      data.map(function (d) {
        return d.country;
      })
    ),
  ];

  // Create an array of color scales
  var colorScale = d3.scaleOrdinal().domain(countries).range(d3.schemeSet1);

  // Create scales for x and y
  var x = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    )
    .range([0, width]);

  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d.gdp;
      }),
    ])
    .range([height, 0]);

  // Define the line function
  var line = d3
    .line()
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y(d.gdp);
    });

  // Draw the x-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(10));

  // Draw the y-axis
  svg.append("g").call(d3.axisLeft(y).ticks(10));

  // Y-axis label
  svg
    .append("text")
    .attr("class", "y-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15 - margin.left)
    .style("text-anchor", "middle")
    .text("GDP"); // Replace with your desired y-axis label

  // Create a group for each country's line
  var countryGroups = svg
    .selectAll(".country")
    .data(countries)
    .enter()
    .append("g")
    .attr("class", "country");

  // Draw lines for each country
  countryGroups
    .append("path")
    .datum(function (d) {
      return data.filter(function (e) {
        return e.country === d;
      });
    })
    .attr("fill", "none")
    .attr("stroke", function (d) {
      return colorScale(d[0].country);
    })
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 5)
    .attr("d", line);

  // Add markers (circles) for data points for each country
  countryGroups
    .selectAll("circle")
    .data(function (d) {
      return data.filter(function (e) {
        return e.country === d;
      });
    })
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.date);
    })
    .attr("cy", function (d) {
      return y(d.gdp);
    })
    .attr("r", 5)
    .attr("fill", "black");

  // Create a legend
  var legend = svg
    .selectAll(".legend")
    .data(countries)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return `translate(0,${i * 20})`;
    });

  legend
    .append("rect")
    .attr("x", 20)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function (d) {
      return colorScale(d);
    });

  legend
    .append("text")
    .attr("x", 45)
    .attr("y", 9)
    .attr("dy", ".3em")
    .style("text-anchor", "start")
    .style("font-size", "13px")
    .text(function (d) {
      return d;
    });

  // Append text labels to represent countries at the last data point
  countryGroups
    .append("text")
    .datum(function (d) {
      return data
        .filter(function (e) {
          return e.country === d;
        })
        .slice(3); // Get the last data point
    })
    .attr("x", function (d) {
      return x(d[0].date) - 10; // Adjust the x-coordinate for proper placement
    })
    .attr("y", function (d) {
      if (d[0].country === "Brazil") {
        return y(d[0].gdp) + 20;
      } else if (d[0].country === "New Zealand") {
        return y(d[0].gdp) + 15;
      }
      return y(d[0].gdp) - 20;
    })
    .text(function (d) {
      return d[0].country;
    })
    .style("font-size", "12px")
    .style("alignment-baseline", "middle");

  // title
  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .text("GDP Per Capita");
});
