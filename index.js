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
