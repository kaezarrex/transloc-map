function forEach(list, callback) {
    var i = 0;
        len = list.length;

    for (; i < len; i++) {
        callback(list[i]);
    }
}

function createInfoWindow(agency, callback) {
    var agency_id = agency.agency_id,
        content;

    if (agency.url) {
        content = '<a target="_blank" href="' + agency.url + '">' + agency.long_name + '</a>';
    } else {
        content = '<div>' + agency.long_name + '</div>';
    }

    $.getJSON('/api/vehicles?agencies=' + agency_id, function(res) {
        var vehicles = res.data[agency_id] || [],
            numVehicles = vehicles.length;

        content += '<div>' + numVehicles + ' vehicles</div>';

        callback(new google.maps.InfoWindow({
            content: content
        }));
    });
}

var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(35, -95)
};

map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

$.getJSON('/api/agencies', function(res) {
    forEach(res.data, function(agency) {

        var position = new google.maps.LatLng(agency.position.lat, agency.position.lng),
            marker;

        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: agency.long_name
        });

        google.maps.event.addListener(marker, 'click', function() {
            createInfoWindow(agency, function(infowindow) {
                infowindow.open(map,marker);
                google.maps.event.addListener(map, 'click', function() {
                    infowindow.close();
                });
            });
        });
    });
});
