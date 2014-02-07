## jqDirect()

**jqDirect** is a minimalistic plugin for jQuery that gets Google Map directions from one address to another. Having a map 
on the page is totally optional & directions are printable with a built in method. Take a look at `index.html` for 
examples or check out the [demo](http://istocode.com/shared/jqDirect/).

## Usage
Load **jQuery (1.9.1+)**, **Google Maps v3**, and **jqDirect**:

	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
	<script src="jqDirect.min.js"></script>	
 
**Create a map** with an initial marker:
	
	// HTML
	<div id="map-canvas"></div>

	// JS
	var $map = $('#map-canvas');
	$map.jqDirect({
		to: 'Raleigh, NC'
	});


**Get directions** from one address to another:
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
	
**Print** the outputted directions:

       // A link to trigger printing
      var $print = $('#print');

      // It's important to first remove the event because some Browsers trigger `print()` more than once
      $print.off('click.jqdirect');
      $print.on('click.jqdirect', function (e) {
         e.preventDefault();

         // If output has the directions
         if ($output.children().length) {
            $map.jqDirect('print'); // call jqDirect's built in method
         }
      });
      
**Add additional markers** to the map if needed:
	
	// Both are equivalent
	$map.jqDirect("addMarker", 'Boston, MA');
	$map.data('jqdirect').addMarker('Raleigh, NC');
	
	
## Known Issues

1. <del>When printing directions, the map may fall in between 2 printing pages, therefore showing cut off.</del>

