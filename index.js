var linky = require('linky'),
    sanitize = require('sanitize-caja'),
    MetaLayer = require('./metalayer');

module.exports = function(d3) {
    function metatip(map) {

        var dispatch = d3.dispatch('save', 'del', 'config'),
            elements = [
                'h1',
                'h2',
                'h3',
                'p',
                'pre',
                'img'
            ],
            layer,
            mode = 'view',
            config = {
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

            if (!Object.keys(properties).length) {
                properties = { '': '' };
                mode = 'edit';
            }

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
                    if (d === 'view') drawView();
                    if (d === 'edit') draw();
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

            function drawView() {
                var field = viewpane
                    .selectAll('div.field')
                    .data(pairs, function(d) {
                        return d.key;
                    });

                field.exit().remove();

                field
                    .enter()
                    .append('div')
                    .attr('class', 'field');

                field
                    .html('')
                    .call(fieldFormat(config.fields));
            }

            var editpane = sel
                .append('div')
                .attr('class', 'pad1 edit pane')
                .classed('hide', mode === 'view');

            var table = editpane
                .append('table');

            drawView();
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

            function pairsObject(pairs) {
                var o = {};

                pairs.forEach(function(p) {
                    if (p.key) o[p.key] = pairs[p.value];
                });

                return o;
            }

            function save() {
                pairs = read();
                dispatch.save({
                    layer: e.target,
                    data: pairsObject(read())
                });
            }

            function read() {
                var pairs = [];

                table
                    .selectAll('tr')
                    .each(collect);

                function collect() {
                    pairs.push({
                        key: d3.select(this).select('input.key').property('value'),
                        value: d3.select(this).select('input.value').property('value')
                    });
                }

                return pairs;
            }

            function addRow() {
                pairs = read();
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
                    })
                    .on('keyup', function(d) {
                        d.key = this.value;
                    });

                enter.append('td')
                    .append('input')
                    .attr('type', 'text')
                    .attr('class', 'value')
                    .property('value', function(d) {
                        return d.value;
                    })
                    .on('keyup', function(d) {
                        d.value = this.value;
                    });

                var gear = enter.append('td')
                    .attr('class', 'gear');

                gear.append('button')
                    .text('*')
                    .on('click', configure);

                var configUI = gear.append('div')
                    .attr('class', 'config hide');

                var selectUI = configUI
                    .append('select')
                    .on('change', function(d) {
                        var elem = d3.select(this).property('value'), c;
                        if (config.fields[d.key]) c = config.fields[d.key];
                        else c = config.fields[d.key] = {};
                        c.elem = elem;
                        dispatch.config(config.fields);
                    });

                selectUI.selectAll('option')
                    .data(elements)
                    .enter()
                    .append('option')
                    .text(String);

                selectUI.property('value', function(d) {
                    return (config.fields[d.key] || { elem: 'span' }).elem;
                });
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
                var selection = d3.select(this),
                    f = fields[d.key] || { elem: 'span' },
                    elem = selection.append(f.elem);

                if (f.elem === 'img') {
                    elem.attr('src', d.value);
                } else {
                    elem.html(sanitize(linky('' + d.value, {
                        target: '_blank'
                    })));
                }

                selection
                    .append('div')
                    .attr('class', 'label')
                    .text(d.key);
            });
        };
    }

    function stopProp() {
        d3.event.stopPropagation();
    }

    return metatip;
};

function key(d) { return d.key; }
