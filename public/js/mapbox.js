
export const displayMap = (locations) =>{

  // Add markers to the map
  var map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: false
  });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);
  var myIcon = L.icon({
    iconUrl: '../img/leaf-green.png',
    shadowUrl: '../img/leaf-shadow.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [12, -98]
    // shadowSize: [68, 95],
  });
  const points = [];
  console.log(locations);
  locations.forEach(location => {
    points.push([location.coordinates[1], location.coordinates[0]]);
    L.marker([location.coordinates[1], location.coordinates[0]], { icon: myIcon })
      .addTo(map)
      .bindPopup(`<p>Day ${location.day}: ${location.description}</p>`, {
        autoClose: false
      })
      .openPopup();
  });
  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);
}
