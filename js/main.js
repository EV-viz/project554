mapboxgl.accessToken =
  "pk.eyJ1Ijoibm9jZXJhIiwiYSI6ImNpbGk2bjNiMTJ2eXV2YW1jdjdweWFtbXoifQ.s6Om8LNYd93IpsgqUqpLzA";

var map = new mapboxgl.Map({
  container: "map3", // container id
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: [-121.9042972, 47.5913463], // starting position [lng, lat]
  zoom: 6, // starting zoom
});

map.on("load", function () {
  fetch("./data/test.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((point) => {
        new mapboxgl.Marker()
          .setLngLat([point.lat, point.lon])
          .setPopup(
            new mapboxgl.Popup().setHTML("<h3>" + point.county + "</h3>")
          )
          .addTo(map);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
