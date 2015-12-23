
var toRadians = Math.PI / 180;

var defaultOpts = {
	radius: 200,
	thickness: 10,
	resolution: 1,
	debug: false,
	debugColor: '#dddddd',
	debugAlpha: 0.05,
	color: '#ffffff',
	stepMin: 1 * toRadians, // the minimum arc texture size in radians
	stepMax: 90 * toRadians // // the maximum arc texture size in radians
};

var ArcSprites = function( opts ){

	this._opts = opts || defaultOpts;

	if( this._opts !== defaultOpts ){
		for( var key in defaultOpts ){
			if( !this._opts[key] ){
				this._opts[key] = defaultOpts[key];
			}
		}
	}

	this._steps = [];

	var pushStep = function( radians ){
		this._steps.push( {
			radians: radians,
			texture: null,
			canvas: null
		})
	}.bind(this);

	var min = this._opts.stepMin;
	var max = this._opts.stepMax;

	while( min < max ){
		pushStep( min );
		min *= 2;
	}
	if( min !== max ){
		pushStep( max );
	}

};


module.exports = ArcSprites;


ArcSprites.prototype = {

	create: function( pool ){

	},

	generate: function( map ){

		// for now keep dimensions of canvases the same.
		//var w = 128;//( this._opts.radius/2 ) + ( this._opts.thickness * 2 );
		//var h = 128;//w;//this._opts.radius/2;

		var w = ( this._opts.radius / 2 ) + ( this._opts.thickness * 2 );
		var h = w;

		w *= this._opts.resolution;
		h *= this._opts.resolution;

		var radians,context;
		var canvas;
		var texture;
		var entry;

		for( var i = 0; i<this._steps.length; i++ ){
			canvas = document.createElement( 'canvas' );

			canvas.width = w;
			canvas.height = h;

			entry = this._steps[i];
			radians = entry.radians;

			//arc(x, y, radius, startAngle, endAngle, anticlockwise)
			context = canvas.getContext('2d');


			if( this._opts.debug ){
				context.globalAlpha = this._opts.debugAlpha;
				context.fillStyle = this._opts.debugColor;
				context.rect(0,0,w+1,h+1);
				context.fill();
			}

			context.globalAlpha = 1.0;
			context.beginPath();
			var padd = this._opts.stepMin * 0.5;
			context.arc( 0,0, ( this._opts.radius * this._opts.resolution ) / 2, -padd, radians+(padd*1.5), false );

			context.lineWidth = this._opts.thickness * this._opts.resolution;
			context.strokeStyle = this._opts.color;
			context.stroke();

			//context.fillStyle = this._opts.color;
			//context.fill();
			//console.log( 'DEG : ', i, entry, deg, radians );



			entry.canvas = canvas;
			if( map ) {
				texture = map(canvas, radians);
				entry.texture = texture;
			}

		}
	},

	drawRadians: function( radians, draw ){

		var count = 0;
		var stepStart = this._steps.length-1;
		var entry;
		var div;
		var rad = radians;

		while( stepStart >= 0 ){
			entry = this._steps[stepStart];
			div = Math.floor( rad / entry.radians );

			//console.log( 'ENTRY : ', entry.radians );

			for( var i = 0; i<div; i++ ){

				draw( count, radians - rad, entry.texture );
				rad -= entry.radians;
				count++;

			}

			//console.log( 'STEP :', stepStart );
			stepStart--;

		}
	}

};
