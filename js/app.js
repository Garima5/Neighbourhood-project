var map;
var markers = [];
var model = [{ //contains list of places
        title: 'Park Ave Penthouse',
        location: {
            lat: 40.7713024,
            lng: -73.9632393
        },
        type: 'house'
    },
    {
        title: 'Hells Kitchen',
        location: {
            lat: 40.7638,
            lng: -73.9918
        },
        type: 'restaurant'
    },
    {
        title: 'Chelsea Loft',
        location: {
            lat: 40.7444883,
            lng: -73.9949465
        },
        type: 'house'
    },
    {
        title: 'Union Square Open Floor Plan',
        location: {
            lat: 40.7347062,
            lng: -73.9895759
        },
        type: 'house'
    },
    {
        title: 'East Village Hip Studio',
        location: {
            lat: 40.7281777,
            lng: -73.984377
        },
        type: 'house'
    },
    {
        title: 'TriBeCa Artsy Bachelor Pad',
        location: {
            lat: 40.7195264,
            lng: -74.0089934
        },
        type: 'house'
    },
    {
        title: 'Chinatown Homey Space',
        location: {
            lat: 40.7180628,
            lng: -73.9961237
        },
        type: 'house'
    },
    {
        title: 'Rockfeller Center',
        location: {
            lat: 40.7587,
            lng: -73.9787
        },
        type: 'work'
    },
    {
        title: 'Times Square',
        location: {
            lat: 40.7590,
            lng: -73.9845
        },
        type: 'shopping'
    },
    {
        title: 'Columbia University',
        location: {
            lat: 40.8075,
            lng: -73.9626
        },
        type: 'university'
    },
    {
        title: 'United Nations Headquarter',
        location: {
            lat: 40.7489,
            lng: -73.9680
        },
        type: 'unitednations'
    },
    {
        title: 'Empire State Building',
        location: {
            lat: 40.7484,
            lng: -73.9857
        },
        type: 'monument'
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
