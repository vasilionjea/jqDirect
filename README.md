# jqDirect()
---------------

jqDirect is a minimalistic plugin for jQuery that gets Google Map directions from one address to another. Having a map on the page is totally optional. Take a look at `index.html` for examples or check out the [demo](http://istocode.com/shared/jqDirect/).

## Usage
### Load jQuery, Google Maps V3, and jqDirect:

	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
	<script src="jqDirect.min.js"></script>	
 
### Create a map with an initial marker:
	
	// HTML
	<div id="map-canvas"></div>

	// JS
	var $map = $('#map-canvas');
	$map.jqDirect({
		to: 'Raleigh, NC'
	});


### Get directions from one address to another:
_This example could be triggered on some event... like a form `submit()`_:
	
	// somewhere on the page you have this: <div id="directions-output"></div>
	var $output = $('#directions-output');
	
	// Use $({}) if you don't have/want a map
	$map.jqDirect('calcRoute', {
		'from': 'Boston, MA', 

		// You can specify a different 'to' address here (* by default it uses the one you set above )
		// 'to': 'New York, NY',

		// Where should the list of directions output?
		'output': $output
	});
	
### Print the outputted directions:

      // Printing...
      var $print = $('#print'); // a link to trigger printing

      // It is important to first remove the event because some Browsers trigger print() more than once
      $print.off('click.jqdirect');
      $print.on('click.jqdirect', function (e) {
         e.preventDefault();

         // If output has the directions
         if ($output.children().length) {
            $map.jqDirect('print'); // call jqDirect's built in method
         }
      });
      
### Add markers to the map
	
	// Both are equivalent
	$map.jqDirect("addMarker", 'Boston, MA');
	$map.data('jqdirect').addMarker('Raleigh, NC');
