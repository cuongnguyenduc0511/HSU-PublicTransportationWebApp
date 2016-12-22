/**
 * Created by Cuong Nguyen on 12/14/2016.
 */
var map;
var allBuses;
var directionsService;
var directionsDisplay;
var zone_location;
var spinner,spinner2;
var zoneMarker;
var lie_fi_Interval;
var default_lat_lng = {lat: 10.7811008,lng:106.6770671};
var on_check_lie_fi_process = 0;
var on_check_connection_process = 0;
var is_Lie_fi = 0;
var opts = {
    lines: 13 // The number of lines to draw
    , length: 17 // The length of each line
    , width: 7 // The line thickness
    , radius: 27 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
}
var styles = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#523735"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#c9b2a6"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#dcd2be"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ae9e90"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#93817c"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#a5b076"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#447530"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fdfcf8"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f8c967"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#e9bc62"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e98d58"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#db8555"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#806b63"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8f7d77"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#b9d3c2"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#92998d"
            }
        ]
    }
];

function initMap(curLat,curLng)
{
    map = new google.maps.Map(document.getElementById("nearby-bus-map"), {
        center: {lat: curLat, lng: curLng},
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    //Responsive Size Map
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    map.addListener("zoom_changed",function(){
        console.log("Zoom changed !");
        check_connection_while_zoom_map();
    });
}

$(function(){
    is_Lie_fi = 0;
    initialize(default_lat_lng.lat,default_lat_lng.lng);
});

function initialize(lat,lng)
{
    if(navigator.onLine)
    {
        //Ẩn thông báo offline
        $("div").has("#offline-alert").hide();

        //Ẩn tùy chọn điều hướng
        $("#nearby-bus-routing-options").hide();

        //Kiểm tra mạng bằng cách gửi request AJAX
        console.log('You might be online ! Begin to test if connection is successful !');
        var requesturl = 'https://csi.gstatic.com/csi?v=2&s=mapsapi3&v3v=26.16&action=apiboot2&libraries=places%2Cgeometry&rt=main.7';
        $.ajax({
            url: requesturl,
            dataType: 'xml',
            method: "GET",
            timeout: 5000
        }).done(function() {
            //Gửi Thành công -> load bản đồ
            console.log("Request success ! Online map activated ");
            //Hiện online map
            $("#nearby-bus-map").show();

            //Ẩn offline map
            $("#nearby-bus-offline-map").hide();

            //Hiện tùy chọn điều hướng
            $("#nearby-bus-routing-options").show();

            //Vô hiệu hóa tùy chọn điều hướng
            disableNearbyBusRoutingOption();

            //Xóa dữ liệu tùy chọn điều hướng
            clearOptions();

            //Load bản đồ
            initMap(lat,lng);
        }).fail(function() {
            //Gửi Thất bại chạy offline
            console.log("Request failed ! Offline function activated ");
            $("div").has("#offline-alert").show();
            $("#nearby-bus-map").hide();
            $("#nearby-bus-offline-map").show();
            $("#nearby-bus-routing-options").hide();
            lie_fi_detect();
        })
    }
    else
    {
        console.log("You are offline !");
        $("div").has("#offline-alert").show();
        $("#nearby-bus-map").hide();
        $("#nearby-bus-offline-map").show();
        $("#nearby-bus-routing-options").hide();
    }
}

function check_connection_while_zoom_map()
{
    if(on_check_lie_fi_process == 0)
    {
        console.log("begin running check !");
        on_check_lie_fi_process = 1;
        var requesturl = 'https://csi.gstatic.com/csi?v=2&s=mapsapi3&v3v=26.16&action=apiboot2&libraries=places%2Cgeometry&rt=main.7';
        $.ajax({
            url: requesturl,
            dataType: 'xml',
            method: "GET",
            timeout: 5000
        }).fail(function() {
            //Gửi Thất bại chạy offline
            console.log("Request failed ! Offline function activated ");
            $("div").has("#offline-alert").show();
            $("#nearby-bus-map").hide();
            $("#nearby-bus-offline-map").show();
            $("#nearby-bus-routing-options").hide();
            lie_fi_detect();
        }).always(function(){
            on_check_lie_fi_process = 0;
            if(is_Lie_fi === 1)
            {
                offlineFindBus();
            }
        });
    }
}

function check_connection_status()
{
    if(on_check_connection_process == 0 && navigator.onLine)
    {
        on_check_connection_process = 1;
        var requesturl = 'https://csi.gstatic.com/csi?v=2&s=mapsapi3&v3v=26.16&action=apiboot2&libraries=places%2Cgeometry&rt=main.7';
        $.ajax({
            url: requesturl,
            dataType: 'xml',
            method: "GET",
            timeout: 5000
        }).done(function(){
            is_Lie_fi = 0;
        }).fail(function() {
            is_Lie_fi = 1;
        }).always(function(){
            on_check_connection_process = 0;
            console.log("Check Process !");
            if(is_Lie_fi === 0)
            {
                console.log("You're online now ! Begin to clear interval");
                clearInterval(lie_fi_Interval);

                //Ẩn thông báo offline
                $("div").has("#offline-alert").hide();

                //Hiện map online
                $("#nearby-bus-map").show();

                //Ẩn map offline
                $("#nearby-bus-offline-map").hide();

                //Hiện tùy chọn điều hướng
                $("#nearby-bus-routing-options").show();

                findNearbyBuses();
            }
            else
            {
                console.log("You're still liefi !");
            }
        });
    }
}

function lie_fi_detect()
{
    if(is_Lie_fi == 0)
    {
        is_Lie_fi = 1;
        lie_fi_Interval = setInterval(check_connection_status,1000);
    }
}

window.addEventListener("online",function(){
    zone_location = $.parseJSON($("#zone").find(":selected").attr("data-value"));
    var curLat = parseFloat(zone_location.lat);
    var curLng = parseFloat(zone_location.lng);
    initialize(curLat,curLng);
});

window.addEventListener("offline",function(){
    initialize(default_lat_lng.lat,default_lat_lng);
    is_Lie_fi = 0;
    clearInterval(lie_fi_Interval);
});

$("#find-bus").click(function () {
    findbus();
});

$("#route-nearby-bus").click(function(){
    checkConnection_Routing();
});

function findbus()
{
    //Kiểm tra mạng
    if(navigator.onLine && is_Lie_fi === 0)
    {
        // Nếu online -> bật xoay
        var target = document.getElementById('spin');
        spinner = new Spinner(opts).spin(target);

        //tắt nút trong lúc đang xoay
        $("#find-bus").attr('class','btn btn-danger btn-lg disabled');
        $("#find-bus").attr("disabled","disabled");
        $("#route-nearby-bus").attr('class','btn btn-info btn-lg disabled');
        $("#route-nearby-bus").attr("disabled","disabled");

        $("#zone").attr("disabled","disabled");
        $("#start").attr("disabled","disabled");
        $("#destination").attr("disabled","disabled");

        //Gửi yêu cầu để check mạng
        var requesturl = 'https://csi.gstatic.com/csi?v=2&s=mapsapi3&v3v=26.16&action=apiboot2&libraries=places%2Cgeometry&rt=main.7';
        $.ajax({
            url: requesturl,
            dataType: 'xml',
            method: "GET",
            timeout: 5000
        }).done(function() {
            //gửi yêu cầu thành công -> có mạng thật sự -> tìm bến xe online
            //Tắt xoay
            spinner.stop();

            //bật nút
            $("#find-bus").attr('class','btn btn-danger btn-lg');
            $("#find-bus").removeAttr("disabled");
            $("#route-nearby-bus").attr('class','btn btn-info btn-lg');
            $("#route-nearby-bus").removeAttr("disabled");

            $("#zone").removeAttr("disabled");
            $("#start").removeAttr("disabled");
            $("#destination").removeAttr("disabled");

            //Ẩn thông báo offline
            $("div").has("#offline-alert").hide();

            //Hiện map online
            $("#nearby-bus-map").show();

            //Ẩn map offline
            $("#nearby-bus-offline-map").hide();

            //Hiện tùy chọn điều hướng
            $("#nearby-bus-routing-options").show();

            //Chức năng tìm bến xe gần nhất
            findNearbyBuses();
        }).fail(function() {
            //gửi yêu cầu thất bại ->  mạng chập chờn -> tìm bến xe offline

            //Tìm bản đồ offline
            offlineFindBus();

            //Tắt xoay
            spinner.stop();

            //bật nút tìm bến xe
            $("#find-bus").attr('class','btn btn-danger btn-lg');
            $("#find-bus").removeAttr("disabled");
            $("#route-nearby-bus").attr('class','btn btn-info btn-lg');
            $("#route-nearby-bus").removeAttr("disabled");

            $("#zone").removeAttr("disabled");
            $("#start").removeAttr("disabled");
            $("#destination").removeAttr("disabled");

            //Hiện thông báo thông báo offline
            $("div").has("#offline-alert").show();

            //Ẩn map online
            $("#nearby-bus-map").hide();

            //Hiện map offline
            $("#nearby-bus-offline-map").show();

            //Ẩn tùy chọn điều hướng
            $("#nearby-bus-routing-options").hide();
            lie_fi_detect();
        })
    }
    else if(!navigator.onLine || (navigator.onLine && is_Lie_fi === 1))
    {
        //Mất mạng hẳn (ko bật 3g/ ko bật modem(wifi) ) -> chạy chức năng offline
        offlineFindBus();
    }
}

function checkConnection_Routing()
{
    //Kiểm tra mạng
    if(navigator.onLine)
    {
        // Nếu online -> bật xoay
        var target = document.getElementById('spin2');
        spinner2 = new Spinner(opts).spin(target);

        //tắt nút khi đang xoay
        $("#find-bus").attr('class','btn btn-danger btn-lg disabled');
        $("#find-bus").attr("disabled","disabled");
        $("#route-nearby-bus").attr('class','btn btn-info btn-lg disabled');
        $("#route-nearby-bus").attr("disabled","disabled");

        //vô hiệu hóa chọn xổ xuống khi đang xoay
        $("#zone").attr("disabled","disabled");
        $("#start").attr("disabled","disabled");
        $("#destination").attr("disabled","disabled");

        //Gửi yêu cầu để check mạng
        var requesturl = 'https://csi.gstatic.com/csi?v=2&s=mapsapi3&v3v=26.16&action=apiboot2&libraries=places%2Cgeometry&rt=main.7';
        $.ajax({
            url: requesturl,
            dataType: 'xml',
            method: "GET",
            timeout: 5000
        }).done(function() {
            //gửi yêu cầu thành công -> có mạng thật sự -> tìm đường đi

            //Tắt xoay
            spinner2.stop();

            //Kích hoạt nút trở lại
            $("#find-bus").attr('class','btn btn-danger btn-lg');
            $("#find-bus").removeAttr("disabled");
            $("#route-nearby-bus").attr('class','btn btn-info btn-lg');
            $("#route-nearby-bus").removeAttr("disabled");

            //Kích hoạt chọn trở lại
            $("#zone").removeAttr("disabled");
            $("#start").removeAttr("disabled");
            $("#destination").removeAttr("disabled");

            //Ẩn thông báo offline
            $("div").has("#offline-alert").hide();

            //Hiện map online
            $("#nearby-bus-map").show();

            //Ẩn map offline
            $("#nearby-bus-offline-map").hide();

            //Hiện tùy chọn điều hướng
            $("#nearby-bus-routing-options").show();

            // Chức năng điều hướng
            Routing(directionsService,directionsDisplay);
        }).fail(function() {
            //gửi yêu cầu thất bại -> có mạng chập chờn -> hiển thị bản đồ offline

            //Tìm bản đồ offline
            offlineFindBus();

            //Tắt xoay
            spinner2.stop();

            //Kích hoạt nút trở lại
            $("#find-bus").attr('class','btn btn-danger btn-lg');
            $("#find-bus").removeAttr("disabled");
            $("#route-nearby-bus").attr('class','btn btn-info btn-lg');
            $("#route-nearby-bus").removeAttr("disabled");

            //Kích hoạt chọn trở lại
            $("#zone").removeAttr("disabled");
            $("#start").removeAttr("disabled");
            $("#destination").removeAttr("disabled");

            //Hiện thông báo thông báo offline
            $("div").has("#offline-alert").show();

            //Ẩn map online
            $("#nearby-bus-map").hide();

            //Hiện map offline
            $("#nearby-bus-offline-map").show();

            //Ẩn tùy chọn điều hướng
            $("#nearby-bus-routing-options").hide();

            //Phát hiện lie-fi
            lie_fi_detect();
        })
    }

}

function findNearbyBuses()
{
    zone_location = $.parseJSON($("#zone").find(":selected").attr("data-value"));
    var selected_index = parseInt($("#zone").prop("selectedIndex"));
    //console.log(zone_location);
    var curLat = parseFloat(zone_location.lat);
    var curLng = parseFloat(zone_location.lng);

    initMap(curLat,curLng);

    createZoneMarker(curLat,curLng);

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;

    infowindow = new google.maps.InfoWindow();

    //Nearby Search
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: {lat: curLat, lng: curLng},
        radius: 300,
        type: ['bus_station']
    }, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            var bounds = new google.maps.LatLngBounds();
            allBuses = [];
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i],bounds);
                addResultsItem(results[i],allBuses);
            }
            populateStartOptions(selected_index);
            populateDestinationOptions();
            enableNearbyBusRoutingOption();
            map.fitBounds(bounds);
        }
    });

}

function populateStartOptions(select_index) {
    var start = [];
    switch (select_index) {
        case 0 :
            start = [{title: 'Đại Học Hoa Sen - Cơ Sở Quang Trung', location: {lat: 10.856844, lng: 106.625808}},
                {title: 'Cổng vào Công Viên', location: {lat: 10.852868, lng: 106.626835}},
                {title: 'Cổng ra Công Viên', location: {lat: 10.852080, lng: 106.629389}}];
            break;

        case 1 :
            start = [{title: 'Đại Học Hoa Sen - Cơ Sở Tản Viên', location: {lat: 10.807035, lng: 106.665629}},
                {title: 'Trung tâm thương mại Superbowl', location: {lat: 10.8083163, lng: 106.6638238}}];
            break;

        case 2 :
            start = [{title: 'Đại Học Hoa Sen - Cơ Sở Nguyễn Văn Tráng', location: {lat: 10.770098, lng: 106.692369}},
                {title: 'Công viên 23/9', location: {lat: 10.769400, lng: 106.692462}}];
            break;
        case 3 :
            start = [{title: 'Đại Học Hoa Sen - Cơ Sở Cao Thắng', location: {lat: 10.772264, lng: 106.679226}},
                {title: 'AEON Citimart Cao Thắng', location: {lat: 10.7713637, lng: 106.6784745}}];
            break;
    }

    //clear old options
    for (var i = $("#start option").length - 1; i >= 0; i--) {
        $("#start option").remove(i);
    }

    //add new options
    for (var j = 0; j < start.length; j++) {
        $('#start').append($('<option>',
            {
                "data-value": '{"lat":'+start[j].location.lat+',"lng":'+start[j].location.lng+'}',
                text : start[j].title
            }));
    }
}

function populateDestinationOptions()
{
    //clear old options
    for(var i = $("#destination option").length - 1 - 1 ; i >= 0 ; i--)
    {
        $("#destination option").remove(i);
    }

    //add new options
    for(var j = 0; j < allBuses.length; j++)
    {
        $('#destination').append($('<option>',
            {
                "data-value": '{"lat":'+allBuses[j].location.lat()+',"lng":'+allBuses[j].location.lng()+'}',
                text : allBuses[j].title
            }));
    }
}

function clearOptions()
{
    //clear start old options
    for (var i = $("#start option").length - 1; i >= 0; i--) {
        $("#start option").remove(i);
    }

    //clear destination old options
    for(var i = $("#destination option").length - 1 - 1 ; i >= 0 ; i--)
    {
        $("#destination option").remove(i);
    }
}

function addResultsItem(results,arr) {
    arr.push({
        "title" : results.name,
        "location": results.geometry.location
    });
}

function createMarker(place,bounds) {
    //var placeLoc = place.geometry.location;

    var icon = {
        url : './images/bus-icon.ico',
        size : new google.maps.Size(50,50),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(15,34),
        scaledSize: new google.maps.Size(40,40)
    };

    var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });

    if(place.geometry.viewport)
    {
        bounds.union(place.geometry.viewport);
    }
    else
    {
        bounds.extend(place.geometry.location);
    }
}

function createZoneMarker(curLat,curLng)
{
    var zonePosition = {lat: curLat, lng: curLng}
    zoneMarker = new google.maps.Marker({
        map: map,
        position: zonePosition
    });
}

function disableNearbyBusRoutingOption()
{
    $("#start").css("background-color","#ebebe0");
    $("#start").attr('disabled','disabled');

    $("#destination").css("background-color","#ebebe0");
    $("#destination").attr('disabled','disabled');

    $("#route-nearby-bus").attr('class','btn btn-info btn-lg disabled');
}

function enableNearbyBusRoutingOption()
{
    $("#start").removeAttr('disabled');
    $("#start").css("background-color","#ffffff");

    $("#destination").removeAttr('disabled');
    $("#destination").css("background-color","#ffffff");

    $("#route-nearby-bus").attr('class','btn btn-info btn-lg');
}

function Routing(directionsService,directionsDisplay)
{
    var start_value = $.parseJSON($("#start").find(":selected").attr("data-value"));

    var startLat = parseFloat(start_value.lat);
    var startLng = parseFloat(start_value.lng);

    var destination_value =  $.parseJSON($("#destination").find(":selected").attr("data-value"));
    var destinationLat = parseFloat(destination_value.lat);
    var destinationLng = parseFloat(destination_value.lng);

    directionsService.route({
        origin: new google.maps.LatLng(startLat, startLng),
        destination: new google.maps.LatLng(destinationLat, destinationLng),
        travelMode: 'WALKING'
    },function(response,status){
        if(status === google.maps.DirectionsStatus.OK)
        {
            directionsDisplay.setMap(map);
            directionsDisplay.setDirections(response);
        }
        else
        {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function offlineFindBus()
{
    var selected_index = parseInt($("#zone").prop("selectedIndex"));
    switch(selected_index)
    {
        case 0: $("#nearby-bus-offline-map-image").attr("src","./images/zone_images/quangtrung.PNG");break;
        case 1: $("#nearby-bus-offline-map-image").attr("src","./images/zone_images/tanvien.PNG");break;
        case 2: $("#nearby-bus-offline-map-image").attr("src","./images/zone_images/nguyenvantrang.PNG");break;
        case 3: $("#nearby-bus-offline-map-image").attr("src","./images/zone_images/caothang.PNG");break;
    }
    $("#nearby-bus-offline-map-image").hide().fadeIn();
}
