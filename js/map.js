var largeinfowindow1;

function initMap() {
        //This program gives the map for a multile location
        //constructor constructs a map,only center and zoom are required
        //This function creates everything after the page loads but before the user interacts with the page


        map = new google.maps.Map(document.getElementById('map'), { //creating a new instance of map--This tells in which html part the map will be shown
            center: {
                lat: 37.4419,
                lng: -122.1430
            }, //this tells what part of the world to show--what image to show and how much should be dtail
            zoom: 13 //Higher the number --higher the detailing--can go upto 21
        });
        //You can use locations from database to render on the map.You can use layer,data layer,fusion layer

        var largeinfowindow = new google.maps.InfoWindow();
        largeinfowindow1 = new google.maps.InfoWindow(); //Info window to be opened when click the list item.Also We are declaring it here becuse map.js loads befor app.ja
        var bounds = new google.maps.LatLngBounds(); //To adjust the listings outside the zoom area.This instance captures the south west and north east corners of the viewport
        //loop through the model array to create an array of markers on initialize
        //var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
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
            // model[i].marker = marker;  
            vm.locationsList()[i].marker = marker; // add marker as a property of each locList location.

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
    //This function populates the infoWindow when the marker is clicked.We will allow only one infowindow which is opened when the marker is clicked and populate based on marker's position
function populateInfoWindow(marker, infowindow) {
    //code help taken from Udacity's code provided in course
    // Check to make sure the infowindow is not already opened on this marker.
    var $body1 = $('#images');
    $body1.empty();
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
        /////////////////////////////
        //Ajax requests using flickr api
        //This api request gives different types of food and people that can be found at that place
        var $body = $('#images');
        var lat = marker.getPosition().lat();
        var long = marker.getPosition().lng();
        console.log(lat);
        console.log(long);
        var urlflikr = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ce3902a4e6719f36c22ceb61431312be&tags=food&text=people&lat=' + lat + '&lon=' + long + '&format=json&nojsoncallback=1';
        $.ajax({
            url: urlflikr,
            dataType: "json",
            success: function(response) {
                console.log(response);
                var articlrList = response.photos.photo;
                var num = Math.floor((Math.random() * 100) + 1);
                for (var i = num; i < num + 2; i++) {
                    var farmid = articlrList[i].farm;
                    var serverid = articlrList[i].server;
                    var photoid = articlrList[i].id;
                    var secret = articlrList[i].secret;
                    // var  size= m;
                    var url = 'https://farm' + farmid + '.staticflickr.com/' + serverid + '/' + photoid + '_' + secret + '.jpg';
                    $("#images").append('<img src="' + url + '" class="thumbnail ">');
                }

            }

        });

        //////////////////////////////////////////////////
        //Wikipedia api
        //This api request appends any wikipedia articles related to the place
       /* var citystr = marker.title;
        console.log(citystr);
        console.log(citystr);
        var playListURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + citystr + '&format=json&callback=wikiCallback';
        $.ajax({
            url: playListURL,
            dataType: "jsonp",
            success: function(response) {
                var articleList = response[1];
                console.log(articleList);
                for (var i = 0; i < articleList.length; i++) {

                    articleStr = articleList[i];
                    // console.log(articleStr);
                    var url = 'https://en.wikipedia.org/wiki/' + articleStr;
                    $("#wikipediaLinks").append('<li><a href="' + url + '">' + articleStr + '</a></li>')
                }
            }

        });*/
        ////////////////////////////////////////////////
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
            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}


////////////////////////////////////////////////////////

function toggleBounce(marker) {
    //function to toggle the marker up and down.Code help from google.developer
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function toggleShape(marker) {

    //function to toggle the marker icon on click
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
        console.log("marker");

    }
}

function stopAnimation(marker) {
    setTimeout(function() {
        marker.setAnimation(null);
    }, 3000);
}
function googleError()
{
    var cssClass;
    var text;
    if (typeof google === 'undefined') {
  cssClass = 'not-loaded';
  text += 'not loaded 😞';
} else {
  cssClass = 'loaded';
  text += 'loaded 😀'
}
console.log(text);

}
/////////////
