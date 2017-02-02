var largeinfowindow1;
/**
* @description creates everything of the map after the page loads but before the user interacts with the page
* @constructor constructs a map,only center and zoom are required
*/
function initMap() {     
    map = new google.maps.Map(document.getElementById('map'), { //creating a new instance of map--This tells in which html part the map will be shown
        center: {
            lat: 37.4419,
            lng: -122.1430
        }, //this tells what part of the world to show--what image to show and how much should be dtail
        zoom: 13 //Higher the number --higher the detailing--can go upto 21
    });
    var largeinfowindow = new google.maps.InfoWindow();
    largeinfowindow1 = new google.maps.InfoWindow(); //Info window to be opened when click the list item.Also We are declaring it here becuse map.js loads befor app.ja
    var bounds = new google.maps.LatLngBounds(); //To adjust the listings outside the zoom area.This instance captures the south west and north east corners of the viewport
    var icons = { //icons based on type of place
        house: {
            icon: 'images/house.png'
        },
        hotel: {
            icon: 'images/hotel.png'
        },
        university: {
            icon: 'images/university.png'
        },
        work: {
            icon: 'images/work.png'
        },
        shopping: {
            icon: 'images/market.png'
        }
    };
    //loop through the model array to create an array of markers on initialize
    for (var i = 0; i < model.length; i++) {
        //get location and title
        var position = model[i].location;
        var title = model[i].title;
        //create markers for each location and put it into markers array
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP, //ADDing animated marker
            title: title,
            icon: icons[model[i].type].icon,
            type: model[i].type,
            animation: google.maps.Animation.DROP,
            id: i
        });
        markers.push(marker);
        marker.setVisible(true);
        vm.locationsList()[i].marker = marker; // add marker as a property of each locationList location.
        //Extend map boundaries for each marker
        bounds.extend(marker.position);
        //create an onclick event to open an infowindow at each marker
        marker.addListener('click', function() {
            populateInfoWindow(this, largeinfowindow); //Tells the info window to open at that marker and populate the information specific to that marker
        });
        marker.addListener('click', function() {
            toggleBounce(this);
            toggleShape(this);
            stopAnimation(this); //to stop the marker from animation bouncing, help from:"http://stackoverflow.com/questions/14657779/google-maps-bounce-animation-on-marker-for-a-limited-period"
        });
    }
    map.fitBounds(bounds);
}
/**
* @description populates the infoWindow when the marker is clicked
* @param {marker} marker
* @param {infowindow} infowindow
*/
function populateInfoWindow(marker, infowindow) {    
    var $body1 = $('#images'); //getting the div with id imges
    $body1.empty(); //clear previous code from div
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        //Ajax requests using flickr api
        //This api request gives different types of food and people that can be found at that place
        var $body = $('#images');
        var lat = marker.getPosition().lat();
        var long = marker.getPosition().lng();
        var urlflikr = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ce3902a4e6719f36c22ceb61431312be&tags=food&text=people&lat=' + lat + '&lon=' + long + '&format=json&nojsoncallback=1';
        var jqxhr = $.ajax({
            url: urlflikr,
            dataType: "json",
            success: function(response) {
                //console.log(response);
                var articlrList = response.photos.photo;
                var num = Math.floor((Math.random() * 100) + 1);
                for (var i = num; i < num + 3; i++) {
                    var farmid = articlrList[i].farm;
                    var serverid = articlrList[i].server;
                    var photoid = articlrList[i].id;
                    var secret = articlrList[i].secret;
                    var url = 'https://farm' + farmid + '.staticflickr.com/' + serverid + '/' + photoid + '_' + secret + '.jpg';
                    $("#images").append('<img src="' + url + '" class="thumbnail ">');
                }

            }

        }).fail(function(xhr, textStatus, errorThrown) {
            var str = "Sory the request failed to load.Try agin after sometime";
            $("#images").append('<div id="errormsg">' + str + '</div>');
        });

        //Below code help taken from Udacity's code provided in course
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}
/**
@description function to toggle the marker up and down.
@param {marker} marker
*/
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}
/**
@description function to toggle the images of marker.
@param {marker} marker
*/
function toggleShape(marker) {
    if (marker.type === 'hotel') {

        marker.setIcon('images/hotfoodcheckpoint.png');
    }
    if (marker.type === 'house') {

        marker.setIcon('images/hut.png');
    }

    if (marker.type === 'university') {

        marker.setIcon('images/school.png');
    }
    if (marker.type === 'work') {

        marker.setIcon('images/office.png');
    }
    if (marker.type === 'shopping') {

        marker.setIcon('images/mall.png');
    } else {      
    }
}
function stopAnimation(marker) {
    //function to stop animation
    setTimeout(function() {
        marker.setAnimation(null);
    }, 3000);
}