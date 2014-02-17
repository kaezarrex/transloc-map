function forEach(list, callback) {
    var i = 0;
        len = list.length;

    for (; i < len; i++) {
        callback(list[i]);
    }
}

var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(35, -95)
};

map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

$.getJSON('/api/agencies', function(res) {
    forEach(res.data, function(agency) {

        var position = new google.maps.LatLng(agency.position.lat, agency.position.lng),
            marker,
            infowindow,
            content;

        if (agency.url) {
            content = '<a target="_blank" href="' + agency.url + '">' + agency.long_name + '</a>';
        } else {
            content = '<div>' + agency.long_name + '</div>';
        }

        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: agency.long_name
        });

        infowindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
        });

        google.maps.event.addListener(map, 'click', function() {
            infowindow.close();
        });
    });
})
