// Affiche le nombre de doigts au centre de l'écran
calcul.liveCounter = function(context) {
    var fingersCount = 0;
    // on va afficher les nombres dans un groupe,
    // ce qui nous permet de contrôler l'order d'affichage
    var group = context.svg.append('svg:g');
    var getFontSize = function() {
        var w = context.size.width;
        var h = context.size.height;
        // hack pour définir une taille de police
        // adaptée à la taille de l'écran
        return Math.min(h/2,w/5);
    };
    var render = function() {
        // on enlève le nombre précédent
        d3.select('text.fingersCount').remove();
        // et on le remplace avec la nouvelle valeur
        group.append('svg:text').
            attr('x','50%').
            attr('y','50%').
            attr('font-size',getFontSize()).
            attr('class','fingersCount').
            text(""+fingersCount);
        // Note: voir le fichier css pour le style
    };

    render();

    return {
        setFingersCount: function(count) {
            fingersCount = count;
            render();
            calcul.sayNumber(count);
        } 
    };
};

(function() {
    // on utilise tout l'écran
    var size = {
        width: $(window).width(),
        height: $(window).height()
    };

    // on crée un context svg pour d3 (rendu)
    var svgContext = calcul.svgContext('#calculBox',size);

        // le nombre de doigts doit être affiché en premier (les doigts
        // doivent être au dessus pour capturer les clicks)
        var countDisplay = calcul.liveCounter(svgContext);
        var fingers = calcul.fingers(svgContext);

        var timeoutHandler = null;
        // quand le nombre de doigts change
        fingers.onUpdate(function() {
            // on stoppe le timeout - on va recommencer
            clearTimeout(timeoutHandler);
            // on attend un peu avant de d'afficher le nomber
            // permet d'éviter des glitchs (plusieurs inputs très rapides)
            timeoutHandler = window.setTimeout(function() {
                countDisplay.setFingersCount(fingers.count());
            }, 100);
        });
})()
