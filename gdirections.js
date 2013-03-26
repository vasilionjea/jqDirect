/* Name: GDirections
 * Description: Gets Google Map directions from one address to another. Having a map on the page is totally optional.
 * Author: Billy Onjea (github.com/vasilionjea/GDirections)
 * License: Same as jQuery
 */
;(function ($) {
    // Default Settings
    var defaults = {
        from: '',
        to: '',
        output: ''
    };

    // Google map references
    var LatLngBounds = new google.maps.LatLngBounds(),
    Geocoder = new google.maps.Geocoder(),
    DirectionsService = new google.maps.DirectionsService(),
    DirectionsRenderer = new google.maps.DirectionsRenderer();

    function GDirections (el, options) {
        this.$el = $(el);

        this.settings = $.extend({}, defaults, options);
        this.directions_list = document.createElement('div');
        this.map = null;
        this.markers = [];
    }

    $.extend(GDirections.prototype, {
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
            var map_canvas = document.getElementById(this.$el.prop('id'));

            var map = new google.maps.Map(map_canvas, {
                zoom: 6,
                mapTypeId: google.maps.MapTypeId['ROADMAP'],
                scrollwheel: false
            });

            google.maps.event.addListenerOnce(map, 'zoom_changed', function () {
                map.setZoom(13);
            });

            return map;
        },

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

        // Adds a new marker to the map
        addMarker: function (geocoded_location) {
            var self = this, marker, str_location;

            // Geocode if needed and try again
            if (!geocoded_location || $.type(geocoded_location) !== 'object') {
                str_location = geocoded_location;

                self._geocode_address(str_location, function (geocoded_location) {
                    self.addMarker(geocoded_location);
                });

                return;
            }

            marker = new google.maps.Marker({
                map: self.map,
                position: geocoded_location
            });

            // Fits LatLngBounds
            LatLngBounds.extend(geocoded_location);
            self.map.fitBounds(LatLngBounds);

            // Very important that we keep track
            self.markers.push(marker);
        },        

        // Calculates route
        calcRoute: function (destination) {
            var self = this, request;
            var $directions_output = destination.output;

            $directions_output.hide();

            // Render on map if we have one
            DirectionsRenderer.setMap(self.map);

            request = {
                origin: destination.from,
                destination: destination.to || self.settings.to,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

            DirectionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    DirectionsRenderer.setDirections(response);
                    DirectionsRenderer.setPanel( self.directions_list );

                    $directions_output
                    .html( self.directions_list )
                    .fadeIn(300);
                }
            });
        },

        print: function () {
            var self = this;
            var iframe, iframeWindow, iframeDocument;
            var $body = $(document.body);

            if ($body.find('#print-frame').length) {
                $body.find('#print-frame').remove();
            }

            iframe = document.createElement('iframe');
            iframe.id = 'print-frame';
            iframe.width = '0';
            iframe.height = '0';
            iframe.src = 'about:blank';

            // Add it to page
            $body.append(iframe);

            iframeWindow = iframe.contentWindow? iframe.contentWindow : iframe.contentDocument.defaultView;
            iframeDocument = iframeWindow.document;

            iframeDocument.open();
            iframeDocument.write( $(self.directions_list).html() );
            iframeDocument.close();

            iframeWindow.print();
            $body.find('#print-frame').remove();
            iframe = null;
        }
    });

    // Plugin namespace
    $.fn.GDirections = function(options, args) {
        return this.each(function () {
            var 
            $this = $(this),
            instance = $this.data('gdirections');

            if (!instance) {
                instance = new GDirections(this, options);
                $this.data('gdirections', instance._init());
            }

            if (typeof options == 'string' && !/_init|_createMap|_geocode_address/.test(options)) {
                instance[options](args);
            }
        });
    };
}(jQuery));