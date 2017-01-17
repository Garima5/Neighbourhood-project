
  var model = [
          {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
          {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
          {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
          {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
          {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
          {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
        ];
 var loc=function(data) //data is an object literal
{
	
	this.title=ko.observable(data.title);
	
	this.location=data.location;
	//The only time we need to write viewModel methods is when we have to change something ourselves

};
var viewModel=function(){
	var self=this;
	
	this.locationsList=ko.observableArray([]);
	model.forEach(function(locName){
		self.locationsList.push(new loc(locName));
	});

this.currentLoc=ko.observable(this.locationsList()[0]);
this.setLoc=function(clickedLoc)
{
	//sets the currentLoc to selected element from the list view
	//console.log(clickedLoc.title);
	this.aloc=ko.observable(clickedLoc.title());
	console.log(this.aloc());
	 self.currentLoc(clickedLoc);
	 console.log(markers.indexOf(this.aloc())); //trying to get the index of marker with same title as that of clicked title

	
}

						
					


};

ko.applyBindings(new viewModel()); 
