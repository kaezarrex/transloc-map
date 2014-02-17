function forEach(list, callback) {
    var i = 0;
        len = list.length;

    for (; i < len; i++) {
        callback(list[i]);
    }
}

function createInfoWindow(agency, callback) {
    var agency_id = agency.agency_id,
        infowindow,
        content;

    if (agency.url) {
        content = '<a target="_blank" href="' + agency.url + '">' + agency.long_name + '</a>';
    } else {
        content = '<div>' + agency.long_name + '</div>';
    }

    infowindow = new google.maps.InfoWindow({
        content: content
    })

    $.getJSON('/api/vehicles?agencies=' + agency_id, function(res) {
        var vehicles = res.data[agency_id] || [];

        content += '<div>' + vehicles.length + ' vehicles</div>';
        infowindow.setContent(content);
    });

    $.getJSON('/api/routes?agencies=' + agency_id, function(res) {
        var routes = res.data[agency_id] || [];

        content += '<div>' + routes.length + ' routes</div>';
        infowindow.setContent(content);
    });

    $.getJSON('/api/stops?agencies=' + agency_id, function(res) {
        content += '<div>' + res.data.length + ' stops</div>';
        infowindow.setContent(content);
    });

    return infowindow
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
            var infowindow = createInfoWindow(agency);

            infowindow.open(map,marker);

            google.maps.event.addListener(map, 'click', function() {
                infowindow.close();
            });
        });
    });
});
