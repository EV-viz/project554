d3.csv("../data/EV_Population_Non_Zero_Range.csv").then((data) => {
    // Read 'Electric Range' and 'Electric Vehicle Type' from the dataset
    data.forEach((d) => {
        d.electricRange = +d['Electric Range'];
        d.vehicleType = d['Electric Vehicle Type'];
    });

    let margin = { top: 40, right: 20, bottom: 50, left: 50 };
    let width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let svg = d3.select("#histogramvv")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Function to calculate histogram bins
    function calculateBins(dataset) {
        let histogram = d3.bin()
            .value((d) => d.electricRange)
            .domain([0, d3.max(dataset, (d) => d.electricRange)])
            .thresholds(d3.range(0, d3.max(dataset, (d) => d.electricRange), 10));
        return histogram(dataset);
    }

    // Calculate bins for the entire dataset
    let allBins = calculateBins(data);
    
    // Find the maximum count in any bin for the entire dataset
    const overallMaxBinCount = d3.max(allBins, (d) => d.length);

    // Function to update the histogram
    function updateHistogram(filterType) {
        let filteredData = data;
        if (filterType !== 'reset') {
            filteredData = data.filter(d => d.vehicleType === filterType);
        }

        let bins = calculateBins(filteredData);

        let x = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.electricRange)])
            .range([0, width]);

        // Y scale - use the overall maximum bin count for domain
        let y = d3.scaleLinear()
            .domain([0, overallMaxBinCount])
            .range([height, 0]);

        let xAxis = d3.axisBottom().scale(x);
        let yAxis = d3.axisLeft().scale(y);

        svg.selectAll("rect").remove(); // Remove previous bars

        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.x0))
            .attr("y", (d) => y(d.length))
            .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
            .attr("height", (d) => height - y(d.length))
            .style("fill", "orange");

        svg.selectAll(".axis").remove(); // Remove previous axes

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis")
            .call(yAxis);
    }

    // Initial histogram display
    updateHistogram('reset');

    // Y-axis label
    svg.append("text")
        .attr("class", "y-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -35)
        .style("text-anchor", "middle")
        .text("Number of Vehicles");

    // X-axis label
    svg.append("text")
        .attr("class", "x-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .style("text-anchor", "middle")
        .text("Electric Range (miles)");

    // Chart title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text("Electric Vehicle Range Distribution");

    // Buttons for filtering
    d3.select("#PHEVButton").on("click", () => updateHistogram('Plug-in Hybrid Electric Vehicle (PHEV)'));
    d3.select("#BEVButton").on("click", () => updateHistogram('Battery Electric Vehicle (BEV)'));
    d3.select("#resetButton").on("click", () => updateHistogram('reset'));
});



// d3.json("../data/pop.json").then((data) => {
//     data.sort((a, b) => b.pop - a.pop);
//     let margin = { top: 40, right: 20, bottom: 25, left: 50 };
//     let width = 600 - margin.left - margin.right,
//       height = 400 - margin.top - margin.bottom;
  
//     let x = d3
//       .scaleBand()
//       .domain(data.map((d) => d.country)) //🚧
//       .range([0, width])
//       .padding(0.2)
//       .paddingInner(0.4);
  
//     let y = d3
//       .scaleLinear()
//       .domain([0, d3.max(data.map((d) => d["pop"]))]) //🚧
//       .range([height - 10, 0]);
  
//     let xAxis = d3.axisBottom().scale(x);
  
//     let yAxis = d3
//       .axisLeft()
//       .scale(y)
//       .tickFormat(d3.format(".2s")) //🚧
//       .ticks(6); //limit the number of tick marks on y axis
  
//     let svg = d3
//       .select("#histogramvv")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//     svg
//       .selectAll("rect")
//       .data(data)
//       .enter()
//       .append("rect")
//       .attr("x", (d) => x(d["country"]))
//       .attr("y", (d) => y(d["pop"]))
//       .attr("width", x.bandwidth)
//       .attr("height", (d) => height - y(d["pop"]))
//       .style("fill", "orange");
  
//     svg
//       .append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .style("font-size", "12px")
//       .call(xAxis);
  
//     svg.append("g").call(yAxis);
  
//     // data label on bars
//     svg
//       .selectAll("myRect")
//       .data(data)
//       .enter()
//       .append("text")
//       .text((d) => d["pop"])
//       .attr("x", (d) => x(d.country) + x.bandwidth() / 2) // Center the text on the bar
//       .attr("y", (d) => y(d["pop"]) - 5) // Adjust the y-coordinate for proper placement
//       .style("font-size", "14px")
//       .style("font-weight", "bold")
//       .style("text-anchor", "middle")
//       .style("alignment-baseline", "middle");
  
//     svg
//       .append("text")
//       .attr("class", "y-label")
//       .attr("transform", "rotate(-90)")
//       .attr("x", -height / 2)
//       .attr("y", -margin.left + 20)
//       .style("text-anchor", "middle")
//       .text("Population");
  
//     // title
//     svg
//       .append("text")
//       .attr("class", "chart-title")
//       .attr("x", width / 2)
//       .attr("y", 0)
//       .attr("text-anchor", "middle")
//       .text("Population");
//   });