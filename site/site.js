var d3 = require('d3'),
    metatip = require('../')(d3),
    map = L.map('map').setView([37.8, -96], 4),
    gjLayer = L.geoJson(statesData);

L.tileLayer('http://a.tiles.mapbox.com/v3/tmcw.map-l1m85h7s/{z}/{x}/{y}.png')
    .addTo(map);

gjLayer.addTo(map);

gjLayer.on('click', metatip().config({
    fields: [
        {
            key: 'name',
            elem: 'h2'
        }
    ]
}));
