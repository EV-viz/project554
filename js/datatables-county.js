window.addEventListener("DOMContentLoaded", (event) => {
  fetch("./data/topc.csv")
    .then((response) => response.text())
    .then((csvData) => {
      const rows = csvData.split("\n").map((row) => row.split(","));

      const table = new simpleDatatables.DataTable("#datatablesSimple2", {
        data: {
          headings: rows[0], // Use the first row as headings
          data: rows.slice(1, 500), // Exclude the first row for data
        },
        searchable: true,
        perPage: 50,
      });
    })
    .catch((error) => console.error("Error fetching or parsing CSV:", error));
});
