;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var metatip = require('../'),
    map = L.map('map').setView([37.8, -96], 4),
    gjLayer = L.geoJson(statesData);

L.tileLayer('http://a.tiles.mapbox.com/v3/tmcw.map-l1m85h7s/{z}/{x}/{y}.png')
    .addTo(map);

gjLayer.addTo(map);

gjLayer.eachLayer(function(l) {
    metatip(l);
});

},{"../":2}],2:[function(require,module,exports){
function metatip(l) {
    var properties = l.toGeoJSON().properties;

    if (!properties) return;

    var table = '';
    if (!Object.keys(properties).length) properties = { '': '' };
    for (var key in properties) {
        table += '<tr><th><input type="text" value="' + key + '" /></th>' +
            '<td><input type="text" value="' + properties[key] + '" /></td></tr>';
    }

    var editView =
        '<table class="marker-properties">' + table + '</table>' +
        '<div class="buttons-joined">' +
            '<button class="add major">add row</button>' +
            '<button class="save">save</button>' +
            '<button class="cancel">cancel</button>' +
            '<button class="delete-invert">remove</button>' +
        '</div>';

    l.bindPopup(L.popup({
        maxWidth: 500,
        maxHeight: 400
    }, l).setContent(
        '<div class="metatip">' +
            '<div class="edit">' +
                editView +
            '</div>' +
        '</div>'));
}

module.exports = metatip;

},{}]},{},[1])
;