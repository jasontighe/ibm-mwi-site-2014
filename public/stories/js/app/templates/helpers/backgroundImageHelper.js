define(['handlebars','jquery'], function ( Handlebars, $ ){

  function backgroundImageHelper ( bgColor, bgImage ) {
    var bgStyle = '';
    var windowWidth = $(window).width();
    //console.log('backgroundImageHelper windowWidth = '+windowWidth +' bgImage = '+bgImage);
    if( windowWidth > 579 ){

      bgStyle = "background: " + bgColor + " url('" + bgImage + "') top center no-repeat;";

    }  else {

      bgStyle = "background-color: "+bgColor;
    }
    //console.log('bgStyle = '+bgStyle);
    return bgStyle;
  }

  Handlebars.registerHelper( 'backgroundImageHelper', backgroundImageHelper );
  return backgroundImageHelper;
});