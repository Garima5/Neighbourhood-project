var map;
			var markers=[];
			function initMap()
			{
				//This program gives the map for a multile location
				//constructor constructs a map,only center and zoom are required
				//This function creates everything after the page loads but before the user interacts with the page
			
				
				map=new google.maps.Map(document.getElementById('map'),{ //creating a new instance of map--This tells in which html part the map will be shown
					center:{lat:40.771324,lng:-73.9632393},//this tells what part of the world to show--what image to show and how much should be dtail
					zoom:13 //Higher the number --higher the detailing--can go upto 21
				});
				//You can use locations from database to render on the map.You can use layer,data layer,fusion layer
				
				var largeinfowindow=new google.maps.InfoWindow();
				var bounds=new google.maps.LatLngBounds(); //To adjust the listings outside the zoom area.This instance captures the south west and north east corners of the viewport
				//loop through the model array to create an array of markers on initialize
				for(var i=0;i<model.length;i++)
				{
					//get location and title
					var position=model[i].location;
					var title=model[i].title;
					//create markers for each location and put it into markers array
					var marker=new google.maps.Marker(
					{
						position:position,
					map:map,
					animation: google.maps.Animation.DROP, //ADDing animated marker
					title:title,
					id:i
					});
					markers.push(marker);
					//Extend map boundaries for each marker
					bounds.extend(marker.position);
					//create an onclick event to open an infowindow at each marker

					marker.addListener('click',function()
					{
						populateInfoWindow(this,largeinfowindow); //Tells the info window to open at that marker and populate the information specific to that marker

					});
				}
				map.fitBounds(bounds);
			}
				//This function populates the infoWindow when the marker is clicked.We will allow only one infowindow which is opened when the marker is clicked and populate based on marker's position
				function populateInfoWindow(marker,infowindow)
				{
					//check to make sure the infowindow is not already open
					if(infowindow.marker !=marker)
					{
						infowindow.marker=marker;
						infowindow.setContent('<div>'+marker.title+'</div>');
						infowindow.open(map,marker);
						//Make sure the marker property is cleared if infowindow is closed
						infowindow.addListener('closeclick',function()
						{
							infowindow.setMarker(null);
						});
					}

				}


