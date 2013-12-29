calcul.equation = function(context) {
    var group = context.svg.append('svg:g').attr('class','equation');
    var max = 5;
    var lhs = 0;
    var rhs = 0;
    var result = 0;
    var textColor = '#0000aa';

    var getFontSize = function() {
        var w = context.size.width;
        var h = context.size.height;
        return Math.min(h/2,w/5);
    };

    var render = function(result) {
        var resultText = (result!==undefined
                      && result!==null) ? result : '?';
        // liste des éléments à afficher (text+position horizontale)
        var data = [
            {text:lhs,x:'12%'},
            {text:'+',x:'31%'},
            {text:rhs,x:'50%'},
            {text:'=',x:'70%'},
            {text:resultText,x:'85%'},
        ];
        // sélection des éléments de texte
        var eq = d3.select('g.equation').selectAll('text.equation').
            data(data);
        // on ajoute un élément texte lorsqu'un élément est ajouté
        eq.enter().
            append('svg:text');
        // propriétés de chaque élément
        eq.attr('x', function(d) { return d.x; }).
            attr('class','equation').
            text(function(d) { return d.text; }).
            attr('y','30%').
            attr('font-size',getFontSize()).
            attr('fill',textColor);
        // on supprime le texte quand un élément est enlevé
        eq.exit().remove();
    };

    var setTextColor = function(color) {
        d3.selectAll('text.equation').
            attr('fill',color);
    };

    var random = function(max) {
        return Math.floor(Math.random()*max)+1;
    };

    var makeEquation = function() {
        result = random(max-1)+1;
        lhs = random(result-1);
        rhs = result-lhs;
        render();
    };

    return {
        next: function() {
            makeEquation();
        },
        setCount: function(count) {
            render(count);
        },
        check: function(count) {
            if (count === result) {
                render(result);
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

    var equation = calcul.equation(svgContext);
    var fingers = calcul.fingers(svgContext);

    equation.next();

    var timeoutHandler = null;
    fingers.onUpdate(function() {
        // on affiche le résultat
        equation.setCount(fingers.count());
        // on stoppe le timeout - on va recommencer
        clearTimeout(timeoutHandler);
        // et on attend un peu avant de le contrôler
        timeoutHandler = window.setTimeout(function() {
            fingers.freeze();
            var done = equation.check(fingers.count());
            if (done) {
                $('audio.bravo').trigger('play');
            }
            window.setTimeout(function() {
                equation.resetCheck();
                if (done) { equation.next(); }
                fingers.clear();
                fingers.unfreeze();
            },2000);
        },1000);
    });

})()
