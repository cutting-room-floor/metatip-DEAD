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

            var viewpane = sel
                .append('div')
                .attr('class', 'pad1');

            viewpane
                .selectAll('div.field')
                .data(pairs)
                .enter()
                .append('div')
                .attr('class', 'field')
                .call(fieldFormat(config.fields));

            var editpane = sel
                .append('div')
                .attr('class', 'pad1')
                .style('display', 'none');

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

                d3.select(this).append(f.elem)
                    .text(d.value);
            });
        };
    }

    return metatip;
};

function key(d) { return d.key; }
