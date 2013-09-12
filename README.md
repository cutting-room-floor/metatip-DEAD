# metatip

Advanced tooltips for Leaflet.

**Styles & content** tooltip content is sanitized with [sanitize-caja](https://github.com/mapbox/sanitize-caja)
linkified with [linky](https://github.com/Colingo/linky), and formatted
into elements of your choice.

**Editing interface** the `edit` tab turns property/value combinations into
an editable table.

## example

```js
gjLayer.on('click', metatip(map).config({
    fields: {
        name: {
            elem: 'h1'
        }
    }
}));
```

## api

### `metatip(map)`

Create a metatip event handler, suitable as a `click` handler on a Leaflet
layer.

#### `metatip.config(configObject)`

Configure the metatip handler with field definitions of the form

```js
{
    fieldname: {
        // one of h1, h2, h3, span, p, img, a, pre
        elem: 'elementtype'
    }
}
```

### `metatip.on('event', handler)

In which `event` is one of `del`, `save`, `config`, and the handler accepts
a data object.

## technicals

Requires [d3js](http://d3js.org/) and a recent [Leaflet](http://leafletjs.com/)
or [MapBox.js](http://www.mapbox.com/mapbox.js/) build.
