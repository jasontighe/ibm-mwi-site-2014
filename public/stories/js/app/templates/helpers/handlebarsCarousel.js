define(['handlebars'], function ( Handlebars ){
  function handlebarsCarousel ( items, options ) {
    // Assume items is an array of assets
    //var out = "<ul>";

    for(var i=0, l=items.length; i<l; i++) {
      out = out + "<div>" + options.fn(items[i]) + "</div>";
    }

    return out ;//+ "</ul>";
  }

  Handlebars.registerHelper( 'handlebarsCarousel',handlebarsCarousel );
  return handlebarsCarousel;
});