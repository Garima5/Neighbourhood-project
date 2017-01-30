
var map;
			var markers=[];
  var model = [
          {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393},type: 'house'},
           {title: 'Hells Kitchen', location: {lat: 40.7638, lng: -73.9918},type: 'restaurant'},
          {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465},type: 'house'},
          {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759},type: 'house'},
          {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377},type: 'house'},
          {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934},type: 'house'},
          {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237},type: 'house'}
        ];
 var loc=function(data) //data is an object literal
{
	
	this.title=ko.observable(data.title);
	
	this.location=data.location;
	this.type=data.type;
	//The only time we need to write viewModel methods is when we have to change something ourselves

};

var viewModel=function(){
	var self=this;
	
	this.locationsList=ko.observableArray([]);
	model.forEach(function(locName){
		self.locationsList.push(new loc(locName));
	});

this.currentLoc=ko.observable(this.locationsList()[0]);

this.searchedName= ko.observable(""); //fills in the input value from text box
self.ShortName = ko.computed(function () {
	//function to split the input string
    return self.searchedName().split(" ");
}, self);

this.setLoc=function(clickedLoc)
{
	//sets the currentLoc to selected element from the list view
	//console.log(clickedLoc.title);
	this.aloc=ko.observable(clickedLoc.title());
	console.log(this.aloc());
	 self.currentLoc(clickedLoc);
	 console.log(clickedLoc.marker.position.lat());
	 //console.log(this.locationsList()[0].title());
	// var largeinfowindow1=new google.maps.InfoWindow(); //creating a new info window
	 
	 populateInfoWindow(clickedLoc.marker,largeinfowindow1); //populating the info window by clicked marker from list

	
}
//var filteredItems;
var locationsTitle=ko.observableArray([]); //List of all the titles
	model.forEach(function(locName){
		locationsTitle.push(new loc(locName).title());
	});
this.searchLoc=function()
{
	

}

this.filteredItems = ko.computed(function() {
    var filter = this.searchedName().toLowerCase();
   // console.log(filter);
    if (!filter) {
    	for (var i = markers.length - 1; i >= 0; i--) {
    		markers[i].setVisible(true); //get all the markers back
    	}
    	
        return this.locationsList();
    } else {
    	
     
        return ko.utils.arrayFilter(this.locationsList(), function(item) {
        	var index=locationsTitle.indexOf(item.title());
        	if(item.title().toLowerCase().indexOf(filter)===-1)
        	{
        		//console.log(locationsTitle.indexOf(item.title()));
        		//var index=locationsTitle.indexOf(item.title()); //get the index of the markers to be removed
        		//markers[index].setMap(null);
        		markers[index].setVisible(false);
        		//return locationsTitle.indexOf(item.title())
        	}
        	else
        	{
        		//console.log(index);
        		markers[index].setVisible(true);

        	}

        	return item.title().toLowerCase().indexOf(filter) != -1; //returns true if filter that is item entered matches the item.title()
        });

    }
}, this);

	
this.resetLoc=function()
{
	this.searchedName("");//To reset the list view filtered items
	for(var t=0;t<markers.length;t++)
	{
		markers[t].setMap(map);
	}

}
					


};

 var vm = new viewModel();
  ko.applyBindings(vm);

//ko.applyBindings(new viewModel()); 

			
