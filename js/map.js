var largeinfowindow1;
/**
 * @description creates everything of the map after the page loads but before the user interacts with the page
 * @constructor constructs a map,only center and zoom are required
 */
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), { //creating a new instance of map--This tells in which html part the map will be shown
        center: {
            lat: 40.7484,
            lng: -73.9857
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
        restaurant: {
            icon: 'images/restaurant.png'
        },
        university: {
            icon: 'images/university.png'
        },
        work: {
            icon: 'images/work.png'
        },
        monument: {
            icon: 'images/moderntower.png'
        },
        unitednations: {
            icon: 'images/world.png'
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
    if (marker.type === 'restaurant') {

        marker.setIcon('images/hotfoodcheckpoint.png');
    }
    if (marker.type === 'house') {

        marker.setIcon('images/hut.png');
    }

    if (marker.type === 'university') {

        marker.setIcon('images/school.png');
    }
    if (marker.type === 'monumemt') {

        marker.setIcon('images/modernmonument.png');
    }
    if (marker.type === 'work') {

        marker.setIcon('images/office.png');
    }
    if (marker.type === 'shopping') {

        marker.setIcon('images/mall.png');
    }
    if (marker.type === 'unitednations') {

        marker.setIcon('images/worldheritagesite.png');
    }
}

function stopAnimation(marker) {
    //function to stop animation
    setTimeout(function() {
        marker.setAnimation(null);
    }, 3000);
}
