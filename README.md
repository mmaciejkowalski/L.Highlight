# L.Highlight
Leaflet plugin for creating highlight area for specified street/place using [Nominatim](https://nominatim.org/).
This plugin adds onto Leaflet.Layer which makes highlighting places like streets, cities etc. a lot easier. It also handles the Nominatim paging of results.

# Requirements 
Leaflet is required before adding L.Highlight. L.Highlight was tested on Leaflet v1.7.1

# Basic Usage: 
Clone the L.Highlight repository by doing:

```
git clone git@github.com:mmaciejkowalski/L.Highlight.git
```

In HTML, import the required Leaflet Javascript and CSS files. 

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
```

In HTML, import the L.Highlight

```html
<script src="leaflet-highlight.min.js"></script>
```

In Javascript, initialize your Leaflet Map

```javascript
var map = L.map('map', {editable: true});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
```

In Javascript, add a layer with user or predefined input

```javascript
// search for Politechniki Avenue around Łódź, Poland
new L.Layer.Highlight().do({q: 'Piotrkowska, Łódź'}).addTo(map);
```

You can also redefine your search for specific street in specific city, in case Nominatim would find another streets with this name in nearby cities.

```javascript
// search for Politechniki Street exactly in Łódź, Poland
new L.Layer.Highlight().do({street: 'Piotrkowska', city: 'Łódź'}).addTo(map);
```

You can also do some more refined things.

```javascript
// search for areas of Łódź University of Technology (Politechnika) in Łódź, Poland, color them red and attach click event handler alerting name of clicked area
new L.Layer.Highlight({email: 'your-email@example.com'}).do({
    q: 'Politechnika, Łódź',
    filter: 'Polygon', 
}, {
    style: function() {return {color: '#f00'}},
    eventHandlers: {
        click: function(area) { 
            alert(area.sourceTarget.feature.properties.display_name)
        }
    }
}).addTo(map);
```

It is nice for using email while calling Nominatim, so be sure to include your email in L.Highlight initialisation.

```javascript
new L.Layer.Highlight({email: your-email@example.com}).do({street: 'Piotrkowska', city: 'Łódź'}).addTo(map);
```

for styling, filtering, areas and more read API Documentation below or visit [demo](http://mmaciejkowalski.github.io/L.Highlight)

# API Documentation: 

## Init options
L.Layer.Highlight accepts an initialisation object
```
{
    email: string // as stated above, it is nice for using email while calling Nominatim
}
```

## Methods
L.Layer.Highlight extends L.Layer, so it allows to use all the L.Layer methods except it will show nothing unless you deliberatly invoke the `do(searchOpts, otherOpts)` before `addTo()`.

The `do(searchOpts, otherOpts)` method accepts two parameters:
### 1. search options
```
{
    q: string, // use this OR city & street
    city: string, // use this OR q
    street: string, // use this OR q
    limit: number, // limit number of results from Nominatim
    filter: string // limit search results for Features of this type
}
```
where `q` is a basic search query, `city` and `street` used at the same time are for advanced street search. Do not use all three at the same time. Also, filter is a GeoJSON [Feature name](https://en.wikipedia.org/wiki/GeoJSON) like `Polygon` or `LineString`.

### 2. other options (what a fancy name!)
```
{
    style: Object,
    eventHandlers: {
        eventName1: function1,
        eventName2: function2,
        eventName3: function3,
        ...
    }
}
```
Where `style` is the same as in [L.geoJSON](https://leafletjs.com/reference-1.7.1.html#geojson) and `eventHandlers` is an object with event names as keys and event handlers as values. These event handlers are then translated to `.on(<String> type, <Function> fn)` method, so:
```
{
    eventHandlers: {
        'click': function(clickTarget) { doSomething(clickTarget); }
    }
}
```
will be translated inside `L.Highlight` to:
```
.on('click', function(clickTarget) { doSomething(clickTarget); })
```
<i>Probably in later releases the implementation of method `on()` will be implemented</i>