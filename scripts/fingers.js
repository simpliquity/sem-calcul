// détecte/compte le nombre de doigts (touch ou souris)
calcul.fingers = function(context) {
    var listeners = $.Callbacks();
    var fingers = []; // doigts détectés (x,y)
    var mouseInput = false; // mode souris? (sinon touch)
    var frozen = false; //détection active (false) ou figée

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
        if(!frozen) {
            renderFingers();
            // on informe les listeners
            listeners.fire();
        }
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
        },
        freeze: function() {
            frozen = true;
        },
        unfreeze: function() {
            frozen = false;
        },
        clear: function() {
            fingers = [];
            renderFingers();
        }
    };
};

