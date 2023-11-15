// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily =
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#292b2c";

async function fetchDataPie() {
  const colorList = ["#28a745", "#ffc107", "#007bff", "#dc3545"];

  let labels = [];
  let dataList = [];
  try {
    const response = await fetch("./data/types.json"); // Replace 'types.json' with your file path
    const jsonData = await response.json();

    jsonData.forEach((item) => {
      labels.push(item.type);
      dataList.push(item.data);
    });

    // Pie Chart
    var ctx = document.getElementById("myPieChart");
    var myPieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels, // text label
        datasets: [
          {
            data: dataList, // number
            backgroundColor: colorList, // bg color of chart
          },
        ],
      },

      options: {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              let dataset = data.datasets[tooltipItem.datasetIndex];
              let total = dataset.data.reduce(
                (previousValue, currentValue) => previousValue + currentValue
              );
              let currentValue = dataset.data[tooltipItem.index];
              let percentage = ((currentValue / total) * 100).toFixed(2) + "%";
              return percentage;
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchDataPie();
