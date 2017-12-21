var map;
var infowindow;
var markers = []; //empty markers array
var latlng = {
	lat: 19.0760,
	lng: 72.8777
}

//function to initialise map
function initMap() {

	var styles = [
          {
            featureType: 'water',
            stylers: [
              { color: '#19a0d8' }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#ffffff' },
              { weight: 6 }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
          },{
            featureType: 'transit.station',
            stylers: [
              { weight: 9 },
              { hue: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
              { visibility: 'off' }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              { lightness: -100 }
            ]
          },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              { visibility: 'on' },
              { color: '#f0e4d3' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -25 }
            ]
          }
        ];

	if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
		map = new google.maps.Map(document.getElementById('map'), {
			center: latlng,
			zoom: 11
		});
	}
  else {
    //error handling for map
    viewModel.unavailable(true);
  }

	infowindow = new google.maps.InfoWindow();

  //declare different icons for mouseover and mouseout events
	var defaultIcon = makeMarkerIcon('800000');
	var highlightedIcon = makeMarkerIcon('FFFF24');

	var tourSpots = viewModel.places();
  //loop through the observable places array and create markers array according to that information
	for(var i = 0; i < tourSpots.length; i++) {

		var position = tourSpots[i].location;
		var title = tourSpots[i].title;

		var marker = new google.maps.Marker({
			position: position,
			title: title,
			map: map,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			id: i
		});

		markers.push(marker); //pushing each marker into the observable markers array

    //adding event listeners to each marker for different colored markers
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});

    //event listener that opens the infowindow on clicking the marker
		marker.addListener('click', function() {
			populateInfoWindow(this);
		});
	}
}

//function to create marker according to different color
function makeMarkerIcon(markerColor) {

	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2', 
		new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34)
    );
    return markerImage;
}

//function to open infowindow and add info from wikipedia to infowindow
function populateInfoWindow(marker) {
	
	if(infowindow.marker != marker) {
		
		infowindow.marker = marker;

		infowindow.setContent('<div class="marker-title">' + marker.title + '</div>');

		infowindow.open(map, marker); //open the infowindow

		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
		});
	}

  //add event listener to each marker to load wikipedia api and grab info
	marker.addListener('click', loadData(marker, infowindow));

  //make each marker bounce!
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
    marker.setAnimation(null);
  }, 600);

}

//function to load wikipedia api and access information and add that to each infowindow
function loadData(marker, infowindow) {

  var $body = $('body');
  var $information = $('.info');
  $information.text = "";

  var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
  $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response){
          $information.text = "";
          var text = response[2];
          console.log(text);
          infowindow.setContent('<div class="marker-title">' + marker.title + '</div>' + '<p class="info">' + text + '</p>');
        }
    }).fail(function(){
        infowindow.setContent('<div class="info">Sorry, wikipedia was unable to load. Check your connection and try again.</div>');
    });

    return false;
}

// Fallback error handling method for Google Maps
mapError = function () {
  viewModel.unavailable(true);
};