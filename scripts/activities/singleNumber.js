calcul.singleNumber = function(context) {
    var group = context.svg.append('svg:g').attr('class','singleNumber');
    var max = 10;
    var number = 0;
    var textColor = '#0000aa';

    var getFontSize = function() {
        var w = context.size.width;
        var h = context.size.height;
        return Math.min(h/2,w/5);
    };

    var render = function(result) {
        d3.selectAll('text.singleNumber').remove();
        group.append('svg:text').
            attr('x','50%').
            attr('y','50%').
            attr('class','singleNumber').
            attr('font-size',getFontSize()).
            attr('fill',textColor).
            text(number);
    };

    var setTextColor = function(color) {
        d3.selectAll('text.singleNumber').
            attr('fill',color);
    };

    var random = function(max) {
        return Math.floor(Math.random()*max)+1;
    };

    return {
        next: function() {
            number = random(max);
            render();
            calcul.sayNumber(number);
        },
        setCount: function(count) {
            render();
        },
        check: function(count) {
            if (count === number) {
                render();
                setTextColor('#00bb00');
                return true;
            } else {
                setTextColor('#ff0000');
                return false;
            }
        },
        resetCheck: function() {
            setTextColor(textColor);
        }
    }
};

(function() {
    // on utilise tout l'écran
    var size = {
        width: $(window).width(),
        height: $(window).height()
    };

    // on crée un context svg pour d3 (rendu)
    var svgContext = calcul.svgContext('#calculBox',size);

    var number = calcul.singleNumber(svgContext);
    var fingers = calcul.fingers(svgContext);

    number.next();

    var timeoutHandler = null;
    fingers.onUpdate(function() {
        // on affiche le résultat
        number.setCount(fingers.count());
        // on stoppe le timeout - on va recommencer
        clearTimeout(timeoutHandler);
        // et on attend un peu avant de le contrôler
        timeoutHandler = window.setTimeout(function() {
            fingers.freeze();
            var count = fingers.count();
            var done = number.check(count);
            calcul.sayNumber(count);
            window.setTimeout(function() {
                number.resetCheck();
                if (done) { number.next(); }
                fingers.clear();
                fingers.unfreeze();
            },3000);
        },1000);
    });

})()
