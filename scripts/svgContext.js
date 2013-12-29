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

