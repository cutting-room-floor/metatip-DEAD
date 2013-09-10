(function(e){if("function"==typeof bootstrap)bootstrap("metatip",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeMetatip=e}else"undefined"!=typeof window?window.metatip=e():global.metatip=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var MetaLayer = require('./metalayer');

module.exports = function(d3) {
    function metatip() {
        function onclick(e) {

            var l = e.layer,
                properties = ('toGeoJSON' in l) && l.toGeoJSON().properties;

            if (!properties) return;

            var layer = (new MetaLayer(e.latlng));

            e.target._map.addLayer(layer);

            if (!Object.keys(properties).length) properties = { '': '' };

            var pairs = d3.entries(properties);

            var sel = d3
                .select(layer._el)
                .append('div')
                .attr('class', 'metatip');

            var toggle = sel
                .append('span')
                .attr('class', 'toggle view')
                .selectAll('a')
                .data(['view', 'edit'])
                .enter()
                .append('a')
                .text(String);

            var editpane = sel
                .append('div')
                .attr('class', 'pad1');

            var table = editpane
                .append('table');

            var actions = editpane
                .append('div')
                .attr('class', 'buttons-joined');

            actions
                .append('button')
                .text('Save')
                .on('click', save);

            actions
                .append('button')
                .text('Cancel')
                .on('click', cancel);

            function save() { }
            function cancel() { }

            function draw() {
                var tr = table
                    .selectAll('tr')
                    .data(pairs, key);

                tr.exit().remove();

                var enter = tr.enter()
                    .append('tr');

                enter.append('th')
                    .append('input')
                    .attr('type', 'text')
                    .property('value', function(d) {
                        return d.value;
                    });

                enter.append('td')
                    .append('input')
                    .attr('type', 'text')
                    .property('value', function(d) {
                        return d.key;
                    });
            }

            draw();
        }

        onclick.config = function(_) {
            if (!arguments.length) return config;
            config = _;
            return onclick;
        };

        return onclick;
    }

    return metatip;
};

function key(d) { return d.key; }

},{"./metalayer":2}],2:[function(require,module,exports){
module.exports = L.Class.extend({

    initialize: function (latlng) {
        this._latlng = latlng;
    },

    onAdd: function (map) {
        this._map = map;
        this._el = L.DomUtil.create('div', 'metatip-layer leaflet-zoom-hide');
        map.getPanes().overlayPane.appendChild(this._el);
        map.on('viewreset', this._reset, this);
        this._reset();
    },

    onRemove: function (map) {
        map.getPanes().overlayPane.removeChild(this._el);
        map.off('viewreset', this._reset, this);
    },

    _reset: function () {
        var pos = this._map.latLngToLayerPoint(this._latlng);
        L.DomUtil.setPosition(this._el, pos);
    }
});

},{}]},{},[1])(1)
});
;