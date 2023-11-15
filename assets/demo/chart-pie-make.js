// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily =
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#292b2c";

async function fetchDataPie2() {
  const colorList = [
    "#28a745",
    "#ffc107",
    "#007bff",
    "#dc3545",

    "gray",
    "lightblue",
  ];
  const topCount = 6; // Define the number of top makes to display

  let labels = [];
  let dataList = [];
  let otherData = 0;

  try {
    const response = await fetch("./data/makes.json"); // Replace 'types.json' with your file path
    const jsonData = await response.json();

    // Sort the data based on 'data' value in descending order
    jsonData.sort((a, b) => b.data - a.data);

    jsonData.slice(0, topCount).forEach((item, index) => {
      labels.push(item.Make);
      dataList.push(item.data);
    });

    // Calculate total 'data' value for makes other than topCount
    jsonData.slice(topCount).forEach((item) => {
      otherData += item.data;
    });

    // Combine other data
    if (otherData > 0) {
      labels.push("Others");
      dataList.push(otherData);
    }

    // Pie Chart
    var ctx = document.getElementById("myPieChart2");
    var myPieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels, // text label
        datasets: [
          {
            data: dataList, // number
            backgroundColor: colorList.slice(0, labels.length), // bg color of chart
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

fetchDataPie2();
