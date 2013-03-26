GDirections
===========

A jQuery plugin that gets Google Map directions from one address to another. Having a map on the page is totally optional. Take a look at `index.html` for examples or check out the [demo](http://istocode.com/shared/gdirections/).

### Usage
This example does the following:
- Creates a Google map
- Adds a marker at the specified address

HTML:

	<div id="map-canvas"></div>

JS:

	$('#map-canvas').GDirections({
		to: 'Raleigh, NC'
	});


Example with directions * _this example could be triggered on some event... like a form `submit()`_:

	// Use $({}) if we don't have/want a map
	$('#map-canvas').GDirections('calcRoute', {
		'from': 'Boston, MA', 

		// You can specify a different 'to' address (* by default it uses the one you set above )
		// 'to': '123 Some other st., Mars, Universe',

		// Where should the list of directions output?
		'output': $('#directions-output')
	});
