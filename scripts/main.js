// le contexte svg dans lequel les
// autres composants dessinent
calcul.svgContext = function(container,size) {
    var svg = d3.select(container).
        append('svg:svg').
        attr('width',size.width).
        attr('height',size.height).
        attr('id','svgBox');
    return {
        svg: svg,
        size: size
    };
};

// détecte/compte le nombre de doigts (touch ou souris)
calcul.fingers = function(context) {
    var listeners = $.Callbacks();
    var fingers = []; // doigts détectés (x,y)
    var mouseInput = false;

    // appelé lors d'un clic de souris
    var click = function() {
        // on active le mode souris
        mouseInput = true;
        var mousePos = d3.mouse(this);
        // on ajoute simplement la position du clic
        // au tableau de doigts
        fingers.push({
            x:mousePos[0],
            y:mousePos[1],
        });
        update();
    };

    // appelé à chaque événement touch
    var touch = function() {
        // on désactive les événements souris
        context.svg.on('click.fingers',null);
        // on extrait tous les touchs actuels
        var touches = d3.touches(this);
        // et on met leur position dans le tableau fingers
        fingers = _.map(touches, function(touch) {
            return {x:touch[0],y:touch[1]};
        });
        update();
    };

    // fonction à appeler après un changement
    var update = function() {
        renderFingers();
        // on informe les listeners
        listeners.fire();
    };

    // on écoute les événement de type click (souris)
    // et touch (start - dès que le doigt touche l'écran)
    context.svg.on('click.fingers',click);
    context.svg.on('touchstart.fingers',touch);
    $(document).on('touchstart', function() {
        // ne fait rien, mais les événements touchstart ne
        // sont pas détectés sur iPad sans ce listener...
    });


    var renderFingers = function() {
        var f = context.svg.selectAll('circle.finger').data(fingers);
        f.enter().append('svg:circle').
            attr("r", '1cm').
            attr("class","finger");
        
        f.attr("cx", function(d,i) { return d.x; }).
            attr("cy", function(d,i) { return d.y; });
        if (mouseInput) {
            // on ajoute un événement click pour enlever ce doigt
            f.on('click', function(d,i) {
                d3.event.stopPropagation();
                fingers = _.without(fingers,d);
                update();
            });
        }

        f.exit().remove();

    };

    // on retourne une API
    return {
        // listeners
        onUpdate: function(cb) {
            listeners.add(cb);
        },
        // le nombre de doigts détectés
        count: function() {
            return fingers.length;
        }
    };
};

// Affiche le nombre de doigts au centre de l'écran
calcul.fingersCountDisplay = function(context) {
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
        //$('#text2').html(fingersCount);
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
    var countDisplay = calcul.fingersCountDisplay(svgContext);
    var fingers = calcul.fingers(svgContext);

    var timeoutHandler = null;
    // quand le nombre de doigts change
    fingers.onUpdate(function() {
        // on stoppe le timeout - on va recommencer
        clearTimeout(timeoutHandler);
        // on attend un peu avant de déclencher une action
        // (afficher le nombre de doigts,
        // ou contrôler le résultat par exemple)
        timeoutHandler = window.setTimeout(function() {
            console.log("Update: "+fingers.count());
            countDisplay.setFingersCount(fingers.count());
        }, 0);
    });

})()
