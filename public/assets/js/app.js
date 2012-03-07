/**********************************************************/
/* Extending native objects like I just don't give a fuck */
/**********************************************************/

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Sum
Array.prototype.sum = function(){
    var len = this.length, tot = 0, i = 0;
    for ( ; i < len; i++ )
        tot += this[i];
    return tot;
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Max
Array.prototype.max = function(){
    return Math.max.apply( Math, this );        
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Min
Array.prototype.min = function(){
    return Math.min.apply( Math, this );        
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Mean
Array.prototype.mean = function(){
    return Math.round( this.sum() / this.length );   
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Median
Array.prototype.median = function(){
    var len = this.length, arr = this.slice(0).sort(function(a, b){
        return a < b ? -1 : 1;
    });
    if ( len % 2 == 0 ) 
    	return Math.round( ( arr[ ( len / 2 ) -1 ] + arr[ ( len / 2 ) ] ) / 2 );
    return arr[ Math.floor( len / 2 ) ];
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Standard Deviation ( original units || percentage )
Array.prototype.stddev = function( percent ){
    var len = this.length, avg = this.mean(), tot = 0, i = 0;
    for ( ; i < len; i++ )
        tot += Math.pow( this[i] - avg, 2 );       
    if ( percent ) 
        return Math.round( ( ( Math.sqrt( tot / len ) ) / avg ) * 100 );
    return Math.round( Math.sqrt( tot / len ) );
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Median Deviation ( original units || percentage )
Array.prototype.meddev = function( percent ){
    var len = this.length, med = this.median(), arr = [], i = 0;
    for ( ; i < len; i++ )
        arr.push( Math.abs( this[i] - med ) );
    if ( percent ) 
        return Math.round( ( ( arr.median() ) / med ) * 100 );
    return arr.median();
};

/***************/
/* Application */
/***************/

(function($, window){
    var $ping = $('#ping'),
        $avg = $('#average'),
        $median = $('#median'),
        $min = $('#min'),
        $max = $('#max'),
        $stddev = $('#stddev'),
        $meddev = $('#meddev'),
        $sample = $('#sample'),
        rate = 1e3,
        pings = [];
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Make request, update values
    function fetch(){
        var start = Date.now();
        $.ajax({
            type: "HEAD",
            url: start,
            success: function(){
                var end = Date.now(), latency = end - start;
                pings.push( latency );
                $ping.html( latency + 'ms' );
                $avg.html( pings.mean() + 'ms' );
                $median.html( pings.median() + 'ms' );
                $min.html( pings.min() + 'ms' );
                $max.html( pings.max() + 'ms' );
                $stddev.html( pings.stddev() + 'ms (' + pings.stddev( true ) + '%)' );
                $meddev.html( pings.meddev() + 'ms (' + pings.meddev( true ) + '%)' );
                $sample.html( pings.length + ' Requests' );
                document.title = 'Pingr | ' + latency + 'ms';
            },
            complete: function(){
                setTimeout(function(){
                    fetch();
                }, rate);
            }
        });
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Initialize
    $(window).on('load', function(){
        fetch();
    });
}(jQuery, window));