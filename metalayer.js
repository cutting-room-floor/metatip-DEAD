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
