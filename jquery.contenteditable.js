// jQuery contentEditable
// URL: http://plugins.jquery.com/contenteditable
// Source: http://github.com/makesites/jquery-contenteditable
//
// Initiated by [Makis Tracend](http://github.com/tracend)
// Distributed by [Makesites.org](http://makesites.org)
// Released under the [MIT license](http://makesites.org/licenses/MIT)

(function( lib ) {

	//"use strict";

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		var deps = ['jquery'];
		define(deps, lib); // give the module a name
	} else if ( typeof module === "object" && module && typeof module.exports === "object" ){
		// Expose as module.exports in loaders that implement CommonJS module pattern.
		module.exports = lib;
	} else {
		// Browser globals
		var Query = window.jQuery; // not supporting other query engines || window.Zepto || window.vQuery;
		lib(Query);
	}
}(function( $ ) {

	var methods = {

		init : function( options ) {

			return this.each(function() {

				var $this = $(this);

				//reset any previous change events set
				$this.unbind("change");

				$this.find('[contenteditable]').each(function() {

					$(this).contentEditable("field", $this);

				});
			});
		},

		field : function( parent ) {

			return this.each(function() {

				var $this = $(this);
				// setting the key based on an attribute available on the same level as 'contentEditable'
				var key = $this.attr("data-key");
				// add triggers
				$this.on('focus', function() {
					var $this = $(this);
					$this.data('enter', $this.html());
					$this.data('before', $this.html());
					return $this;
				}).on('keyup paste', function() {
					var $this = $(this);
					var text = $this.html();
					if ($this.data('before') !== text) {
						$this.data('before', text);
						var data = {};
						data[key] = text;
						parent.trigger({type: 'change', action : 'update', changed: data, changedField: $this});
					}
					return $this;
				}).on('blur', function() {
					var $this = $(this);
					var text = $this.html();
					if ($this.data('enter') !== text) {
						$this.data('enter', text);
						var data = {};
						data[key] = text;
						parent.trigger({type: 'change', action : 'save', changed: data, changedField: $this});
					}
					return $this;
				})
			});
		}
	};

	$.fn.contentEditable = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.contentEditable' );
		}

	};

	// If there is a window object, that at least has a document property
	if( typeof window === "object" && typeof window.document === "object" ){
		// save in the global namespace (not needed?)
		window.jQuery = $;
	}

}));
