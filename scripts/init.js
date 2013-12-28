// crée l'objet principal de l'application: calcul
var calcul = {};

// ajoute une fonction de log, utile pour simplifier
// l'affichage d'informations dans la console javascript du navigateur
calcul.log = function(txt) {
    console.log("Calcul: "+txt);
};

// affiche du texte de debug sur la page
// utile pour les navigateurs mobiles sans console
calcul.debug = function(txt) {
    $('#debug').append(txt);
};

// fonctions globales (évite de tapper calcul.log)
var log = calcul.log;
var debug = calcul.debug;
