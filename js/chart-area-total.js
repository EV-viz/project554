// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily =
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#292b2c";

fetch("./data/EV_Population_TimeSeries_EVType.csv")
  .then((response) => response.text())
  .then((csvData) => {
    const rows = csvData
      .trim()
      .split("\n")
      .map((row) => row.split(","));

    // Extract the headers and data
    const headers = rows[0];
    const data = rows.slice(1);

    // Create separate lists for each column
    const columns = {};
    headers.forEach((header) => {
      columns[header] = [];
    });

    data.forEach((row) => {
      row.forEach((value, index) => {
        columns[headers[index]].push(value);
      });
    });

    var labelList = columns[headers[0]];
    var dataList = columns[headers[4]];

    //

    // Area Chart Example
    var ctx = document.getElementById("myLineChart2");
    var myLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labelList,
        datasets: [
          {
            label: "Sessions",
            lineTension: 0.3,
            backgroundColor: "rgba(2,117,216,0.2)",
            borderColor: "rgba(2,117,216,1)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,117,216,1)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,117,216,1)",
            pointHitRadius: 50,
            pointBorderWidth: 2,
            data: dataList,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              time: {
                unit: "date",
              },
              gridLines: {
                display: false,
              },
              ticks: {
                maxTicksLimit: 13,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                min: Math.min(...dataList) - 100000,
                max: Math.max(...dataList) + 100000,
                maxTicksLimit: 10,
              },
              gridLines: {
                color: "rgba(0, 0, 0, .125)",
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      },
    });
  });
