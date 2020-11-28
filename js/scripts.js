function start() {
  const attrStr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Geocoding <a href="http://nominatim.org/">Nominatim</a>';

  /**
   * first map
   */
  var map1 = L.map("map1").setView([51.759306, 19.458585], 14);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { maxZoom: 18, attribution: attrStr }, { className: "grayscale" }
  ).addTo(map1);

  new L.Layer.Highlight().do({ q: "Piotrkowska, Łódź" }).addTo(map1);

  /**
   * second map
   */
  var map2 = L.map("map2").setView([51.759306, 19.458585], 14);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution: attrStr
    },
    { className: "grayscale" }
  ).addTo(map2);

  new L.Layer.Highlight()
    .do({ street: "Piotrkowska", city: "Łódź" })
    .addTo(map2);

  /**
   * third map
   */
  var map3 = L.map("map3").setView([51.779150, 19.444561], 14);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution: attrStr
    },
    { className: "grayscale" }
  ).addTo(map3);

  new L.Layer.Highlight().do({ q: 'Manufaktura, Łódź', filter: "Polygon", }).addTo(map3);

  /**
   * fourth map
   */
  var map4 = L.map("map4").setView([51.753828, 19.442483], 14);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution: attrStr
    },
    { className: "grayscale" }
  ).addTo(map4);

  new L.Layer.Highlight().do({ q: 'Park Poniatowskiego, Łódź', filter: "Polygon" }, { style: function (x) { return { color: '#0f0' } } }).addTo(map4);

  /**
   * fifth map
   */
  var map5 = L.map("map5").setView([51.750264, 19.453295], 14);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution: attrStr
    },
    { className: "grayscale" }
  ).addTo(map5);

  new L.Layer.Highlight().do({ q: "Politechnika, Łódź", filter: "Polygon" }, { style: function () { return { color: "#f00" }; }, eventHandlers: { click: function (area) { alert(area.sourceTarget.feature.properties.display_name); } } }).addTo(map5);
}