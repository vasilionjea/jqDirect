/* Name: jqDirect
 * Description: Gets Google Map directions from one address to another. Having a map on the page is totally optional.
 * Author: Billy Onjea [istocode.com](github.com/vasilionjea/jqDirect)
 * License: Same as jQuery
 */
;(function ($) {
    // Default settings
    var defaults = {
        from: '',
        to: '',
        output: ''
    };

    var // Google map references
    LatLngBounds = new google.maps.LatLngBounds(),
    Geocoder = new google.maps.Geocoder(),
    DirectionsService = new google.maps.DirectionsService(),
    DirectionsRenderer = new google.maps.DirectionsRenderer();

    function jqDirect (el, options) {
        this.$el = $(el);

        this.settings = $.extend({}, defaults, options);

        this.directions_list = document.createElement('div');
        this.$directions_output = null;

        this.map = null;
        this.markers = [];
    }

    // Methods
    $.extend(jqDirect.prototype, {
        _init: function () {
            var self = this;

            if (self.settings.to) {
                // Create the map
                this.map = this._createMap();

                // Add marker at initial address if we have one
                this._geocode_address(self.settings.to, function (geocoded_location) {
                    self.addMarker(geocoded_location);
                });
            }

            return self;
        },

        _createMap: function () {
            var 
            map_canvas = document.getElementById(this.$el.prop('id')),
            map = new google.maps.Map(map_canvas, {
                zoom: 13,
                mapTypeId: google.maps.MapTypeId['ROADMAP']
            });

            google.maps.event.addListenerOnce(map, 'zoom_changed', function () {
                map.setZoom(15);
            });

            return map;
        },

        // Geocode a string address
        _geocode_address: function (str_address, callback) {
            if (!str_address || !callback) { return; }

            // Geocode the initial location address & and add its marker
            Geocoder.geocode({
                'address': str_address
            }, function (results, status) { // Geocoder callback
                if (status === google.maps.GeocoderStatus.OK) {
                    callback(results[0].geometry.location);
                }
            });
        },

        // Get the string address from geocoded location
        _get_geocoded_address: function (geocoded_location, callback) {
            if (!geocoded_location || !callback) { return; }

            // Geocode the initial location address & and add its marker
            Geocoder.geocode({
                'latLng': geocoded_location
            }, function (results, status) { // Geocoder callback
                if (status === google.maps.GeocoderStatus.OK) {
                    callback(results[0].formatted_address);
                }              
            });
        },        

        // Adds a new marker to the map
        addMarker: function (geocoded_location) {
            var self = this, marker, str_location;

            // undefined, empty string, null...
            if (!geocoded_location) { return; }

            // Geocode if needed
            if (typeof geocoded_location == 'string') {
                str_location = geocoded_location;

                // Geocode string address and try again...
                self._geocode_address(str_location, function (geocoded_location) {
                    self.addMarker(geocoded_location);
                });

                return;
            }

            // Add the marker on our map
            marker = new google.maps.Marker({
                map: self.map,
                position: geocoded_location
            });

            // Fits LatLngBounds
            LatLngBounds.extend(geocoded_location);
            self.map.fitBounds(LatLngBounds);

            // Let's keep track
            self.markers.push(marker);
        },        

        // Calculate route
        calcRoute: function (destination) {
            var self = this, request;
            var $directions_output = self.$directions_output = destination.output;

            $directions_output.hide();

            request = {
                origin: destination.from,
                destination: destination.to || self.settings.to,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

            DirectionsService.route(request, function(result, status) {
                if (status == 'OK') {
                    // Render on map if we have one
                    DirectionsRenderer.setMap(self.map);
                    DirectionsRenderer.setDirections(result);
                    DirectionsRenderer.setPanel( self.directions_list );

                    result.routes[0].copyrights += ' - jqDirect';

                    $directions_output
                    .html( self.directions_list )
                    .fadeIn(300);
                }
            });
        },

        print: function () {
            var 
            self = this,
            $body = $(document.body),
            $oldFrame = $body.find('#print-frame');

            // Remove old one first
            if ($oldFrame.length) { $oldFrame.remove(); }

            var // New iframe
            iframe = document.createElement('iframe'),
            ihtml,
            i_window,
            i_document;

            // iFrame attrs
            iframe.src = '';
            iframe.id = 'print-frame';
            iframe.width = '0';
            iframe.height = '0';
            iframe.scrolling = 'no';
            iframe.border = 0;

            // iframe html
            ihtml = '<!DOCTYPE html> <html lang="en">';
            ihtml += '<head> <meta charset="utf-8">';
            ihtml += '<title>Print Directions</title>';
            ihtml += '<style>';
                ihtml += '/* Google direction overrides */';
                ihtml += '.adp-directions { width:100%; }';
                ihtml += '.adp-substep { border-top:1px solid #f3f3f3; }';
                ihtml += '.adp-placemark { background:none repeat scroll 0 0 transparent; border:none; }';
            ihtml += '</style>';
            ihtml += '</head>';
            ihtml += '<body>';
            ihtml += self.$directions_output.html();
            ihtml += self.$el.wrap('<div />').parent().html(); // hack to get outerHTML
            ihtml += '</body></html>';

            self.$el.unwrap('<div />'); // remove hack

            // Add it to page
            document.body.appendChild(iframe);

            // Get iframe's window & document objects
            i_window = iframe.contentWindow;
            i_document = iframe.contentDocument || i_window.document;

            i_document.open();
            i_document.write(ihtml);
            i_document.close();

            // Give the printed map a general height
            $(i_document).find('#'+self.$el.prop('id')).css({ width:'100%', height:'340px' });

            // ...and print!
            i_window.focus();
            window.setTimeout(function () {
                i_window.print();
            }, 13);
        }
    });

    // Plugin namespace
    $.fn.jqDirect = function(options, args) {
        return this.each(function () {
            var 
            $this = $(this),
            instance = $this.data('jqdirect');

            if (!instance) {
                instance = new jqDirect(this, options);
                $this.data('jqdirect', instance._init());
            }

            if (typeof options == 'string' && !/_init|_createMap|_geocode_address/.test(options)) {
                instance[options](args);
            }
        });
    };
}(jQuery));