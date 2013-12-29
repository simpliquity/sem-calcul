(function() {
    $(document).ready(function() {
        for(var i=1; i<=10; ++i) {
            $('body').append(
                $('<audio></audio>').
                append($('<source>').
                       attr({src:'audio/'+i+'.mp3'}).
                      attr({preload:'preload'})).
                addClass('number'+i));
        }
    });
})()
