// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily =
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#292b2c";

async function fetchDataBar() {
  let labelList = [];
  let dataList = [];

  const response = await fetch("./data/makes.json"); // Replace 'types.json' with your file path
  const jsonData = await response.json();

  jsonData.forEach((item) => {
    labelList.push(item.Make);
    dataList.push(item.data);
  });

  try {
    // Bar Chart
    var ctx = document.getElementById("myBarChart");
    var myLineChart = new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels: labelList,
        datasets: [
          {
            label: "Count",
            backgroundColor: "rgba(2,117,216,1)",
            borderColor: "rgba(2,117,216,1)",
            data: dataList,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
              },
              ticks: {
                maxTicksLimit: 12,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 15000,
                maxTicksLimit: 10,
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchDataBar();
