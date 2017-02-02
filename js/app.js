var map;
var markers = [];
var model = [
    //contains list of places that are in the neighbourhood that I want to live
    {
        title: 'Palo Alto',
        location: {
            lat: 37.4419,
            lng: -122.1430
        },
        type: 'house'
    }, {
        title: 'Stanford University',
        location: {
            lat: 37.427475,
            lng: -122.169719
        },
        type: 'university'
    }, {
        title: 'Mountain View',
        location: {
            lat: 37.386052,
            lng: -122.083851
        },
        type: 'house'
    }, {
        title: 'Menlo Park Central',
        location: {
            lat: 37.4530,
            lng: -122.1817
        },
        type: 'house'
    }, {
        title: 'Stanford Shopping Center',
        location: {
            lat: 37.443126,
            lng: -122.171574
        },
        type: 'shopping'
    }, {
        title: 'Four Seasons Hotel Silicon Valley',
        location: {
            lat: 37.460333,
            lng: -122.142531
        },
        type: 'hotel'
    }, {
        title: 'GooglePlex',
        location: {
            lat: 37.422000,
            lng: -122.084057
        },
        type: 'work'
    }, {
        title: 'Nasa Ames Research Center',
        location: {
            lat: 37.409070,
            lng: -122.063825
        },
        type: 'work'
    }
];
var loc = function(data) {
    this.title = ko.observable(data.title);
    this.location = data.location;
    this.type = data.type;
};
/**
* @description View Model for the project
*/
var viewModel = function() {
    var self = this;
    this.locationsList = ko.observableArray([]);
    model.forEach(function(locName) {
        self.locationsList.push(new loc(locName));
    });
    this.currentLoc = ko.observable(this.locationsList()[0]);
    this.searchedName = ko.observable(""); //fills in the input value from text box
    self.ShortName = ko.computed(function() {
        return self.searchedName().split(" ");
    }, self);    
    this.setLoc = function(clickedLoc) {
        //sets the currentLoc to selected element from the list view
        this.aloc = ko.observable(clickedLoc.title());
        self.currentLoc(clickedLoc);
        populateInfoWindow(clickedLoc.marker, largeinfowindow1); //populating the info window by clicked marker from list
    }
    var locationsTitle = ko.observableArray([]); //List of all the titles
    model.forEach(function(locName) {
        locationsTitle.push(new loc(locName).title());
    });
    this.filteredItems = ko.computed(function() {
        var filter = this.searchedName().toLowerCase();
        if (!filter) {
            for (var i = markers.length - 1; i >= 0; i--) {
                markers[i].setVisible(true); //get all the markers back
            }
            return this.locationsList();
        } else {
            return ko.utils.arrayFilter(this.locationsList(), function(item) {
                var index = locationsTitle.indexOf(item.title());
                if (item.title().toLowerCase().indexOf(filter) === -1) {
                    markers[index].setVisible(false);
                } else {
                    markers[index].setVisible(true);
                }
                return item.title().toLowerCase().indexOf(filter) != -1; //returns true if filter that is item entered matches the item.title()
            });
        }
    }, this);
    this.resetLoc = function() {
        this.searchedName(""); //To reset the list view filtered items
        for (var t = 0; t < markers.length; t++) {
            markers[t].setMap(map);
        }
    }
};
var vm = new viewModel();
ko.applyBindings(vm);