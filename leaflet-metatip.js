(function(e){if("function"==typeof bootstrap)bootstrap("metatip",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeMetatip=e}else"undefined"!=typeof window?window.metatip=e():global.metatip=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var MetaLayer = require('./metalayer');

module.exports = function(d3) {
    function metatip(map) {

        var dispatch = d3.dispatch('save', 'del');

        var elements = [
            'h1',
            'h2',
            'h3',
            'p',
            'pre',
            'img'
        ];
        var layer;
        var mode = 'view';
        var config = {
            fields: {}
        };

        map.on('preclick', clickout);

        function clickout() {
            if (layer) map.removeLayer(layer);
        }

        function onclick(e) {

            if (layer) {
                e.target._map.removeLayer(layer);
            }

            var l = e.layer,
                properties = ('toGeoJSON' in l) && l.toGeoJSON().properties;

            if (!properties) return;

            layer = (new MetaLayer(e.latlng));

            e.target._map.addLayer(layer);

            if (!Object.keys(properties).length) properties = { '': '' };

            var pairs = d3.entries(properties);

            var el = d3
                .select(layer._el)
                .on('click', stopProp)
                .on('mousedown', stopProp)
                .on('mouseup', stopProp);

            if (l.options && l.options.icon && l.options.icon.options.iconAnchor) {
                el.style('margin-bottom', (10 + l.options.icon.options.iconAnchor[1]) + 'px');
            }

            var sel = el.append('div')
                .attr('class', 'metatip');

            function stopProp() {
                d3.event.stopPropagation();
            }

            var toggle = sel
                .append('span')
                .attr('class', 'toggle view')
                .selectAll('a')
                .data(['view', 'edit'])
                .enter()
                .append('a')
                .text(String)
                .on('click', function(d) {
                    var t = this;
                    mode = d;
                    sel.selectAll('.pane').classed('hide', function() {
                        return !d3.select(this).classed(d);
                    });
                    toggle.classed('active', function() {
                        return t == this;
                    });
                })
                .classed('active', function(d) { return d === mode; });

            var close = sel
                .append('span')
                .attr('class', 'close')
                .text('×')
                .on('click', cancel);

            var viewpane = sel
                .append('div')
                .attr('class', 'pad1 view pane')
                .classed('hide', mode === 'edit');

            viewpane
                .selectAll('div.field')
                .data(pairs)
                .enter()
                .append('div')
                .attr('class', 'field')
                .call(fieldFormat(config.fields));

            var editpane = sel
                .append('div')
                .attr('class', 'pad1 edit pane')
                .classed('hide', mode === 'view');

            var table = editpane
                .append('table');

            draw();

            editpane
                .append('button')
                .attr('class', 'add-row')
                .text('+ add row')
                .on('click', addRow);

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

            actions
                .append('button')
                .text('Delete')
                .on('click', del);

            function del() {
                d3.select(this)
                    .text('Sure?')
                    .classed('confirm', true)
                    .on('click', confirmedDel);
            }

            function confirmedDel() {
                cancel();
                dispatch.del({
                    layer: e.target
                });
            }

            function save() { }

            function read() {
                pairs = [];
                table
                    .selectAll('tr')
                    .each(function() {
                        pairs.push({
                            key: d3.select(this).select('input.key').property('value'),
                            value: d3.select(this).select('input.value').property('value')
                        });
                    });
            }

            function addRow() {
                read();
                pairs.push({ key: '', value: '' });
                draw();
            }

            function cancel() {
                e.target._map.removeLayer(layer);
            }

            function draw() {
                var tr = table
                    .html('')
                    .selectAll('tr')
                    .data(pairs, key);

                tr.exit().remove();

                var enter = tr.enter()
                    .append('tr');

                enter.append('th')
                    .append('input')
                    .attr('type', 'text')
                    .attr('class', 'key')
                    .property('value', function(d) {
                        return d.key;
                    });

                enter.append('td')
                    .append('input')
                    .attr('type', 'text')
                    .attr('class', 'value')
                    .property('value', function(d) {
                        return d.value;
                    });

                var gear = enter.append('td')
                    .attr('class', 'gear');

                gear.append('button')
                    .text('*')
                    .on('click', configure);

                var config = gear.append('div')
                    .attr('class', 'config hide');

                config
                    .append('select')
                    .selectAll('option')
                    .data(elements)
                    .enter()
                    .append('option')
                    .text(String);
            }

            function configure() {
                var config = d3.select(d3.select(this)
                    .node()
                    .parentNode)
                    .select('.config');
                config.classed('hide', !config.classed('hide'));
            }
        }

        onclick.config = function(_) {
            if (!arguments.length) return config;
            config = _;
            return onclick;
        };

        return d3.rebind(onclick, dispatch, 'on');
    }

    function fieldFormat(fields) {
        return function(sel) {
            sel.each(function(d) {

                var f = fields[d.key] || {
                    elem: 'span',
                    label: true
                };

                if (f.label) {
                    d3.select(this)
                        .append('div')
                        .attr('class', 'label')
                        .text(typeof f.label === 'string' ? f.label : d.key);
                }

                if (f.elem === 'img') {
                    d3.select(this).append(f.elem)
                        .attr('src', d.value);
                } else {
                    d3.select(this).append(f.elem)
                        .text(d.value);
                }

            });
        };
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