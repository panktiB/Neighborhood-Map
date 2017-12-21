//array of places with title, lat, lng, and observable show for list 
var places = [
	{
		title: 'Cafe Mondegar',
		location: {
			lat: 18.9241,
			lng: 72.8321
		},
		show: ko.observable(true)
	},
	{
		title: 'Four Seasons Hotel Mumbai',
		location: {
			lat: 18.9971,
			lng: 72.8184
		},
		show: ko.observable(true)
	},
	{
		title: 'Gokul',
		location: {
			lat: 18.923100,
			lng: 72.832244
		},
		show: ko.observable(true)
	},
	{
		title: 'Grand Hyatt Mumbai',
		location: {
			lat: 19.0774,
			lng: 72.8513
		},
		show: ko.observable(true)
	},
	{
		title: 'Irani café',
		location: {
			lat: 19.063644,
			lng: 72.862288
		},
		show: ko.observable(true)
	},
	{
		title: 'Kohinoor Square',
		location: {
			lat: 19.0249,
			lng: 72.8415
		},
		show: ko.observable(true)
	},
	{
		title: 'Leopold Cafe',
		location: {
			lat: 18.9227,
			lng: 72.8317
		},
		show: ko.observable(true)
	},
	{
		title: 'Oberoi Trident',
		location: {
			lat: 18.927,
			lng: 72.8204
		},
		show: ko.observable(true)
	},
	{
		title: 'Punjabi Chandu Halwai Karachiwala',
		location: {
			lat: 19.042690,
			lng: 72.863337
		},
		show: ko.observable(true)
	},
	{
		title: 'The Table',
		location: {
			lat: 18.924121,
			lng: 72.833116
		},
		show: ko.observable(true)
	},
	{
		title: 'The Taj Mahal Palace Hotel',
		location: {
			lat: 18.9217,
			lng: 72.8330
		},
		show: ko.observable(true)
	},
	{
		title: 'Watson\'s Hotel',
		location: {
			lat: 18.9283,
			lng: 72.8311
		},
		show: ko.observable(true)
	}
];

//viewModel with observable array of places, markers and an observable var for list
var viewModel = {

	places: ko.observableArray(places),
	markers: ko.observableArray(markers),
	unavailable: ko.observable(false)
};

//observable for filter function to be used in list in nav
viewModel.query = ko.observable('');

//search function for filtering and searching through the list acc to what is typed in searchbox
viewModel.search = function() {
    var q = viewModel.query().toLowerCase();
    if(q.length === 0) {
        viewModel.showAll(true);
    }
    else  {
        ko.utils.arrayFilter(viewModel.places(), function(place) {		
        	var title = place.title.toLowerCase();
        	if (title.indexOf(q) > -1)		
            	place.show(true);
        	else
            	place.show(false);
		});    
    }
};

//function to make all the 'show' of each object in places array to true such that all are visible on list
viewModel.showAll = function(val) {
      
    for (var i = 0; i < viewModel.places().length; i++) {
      viewModel.places()[i].show(val);
    }
};

//function to handle what happens when a list item is clicked on. it opens up that particular infowindow
viewModel.handle = function(location) {
	var self = this;

	for(var i = 0; i < viewModel.markers().length; i++) {
		//setting each marker visibility to true
		viewModel.markers()[i].setVisible(true);

		if(location.title == viewModel.markers()[i].title) {
			populateInfoWindow(viewModel.markers()[i]);
		}
		else {
			viewModel.markers()[i].setVisible(false);//setting visiblity of every other marker to false
		}
	}
};

ko.applyBindings(viewModel);