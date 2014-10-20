(function($) {

	$(window)
		.resize( function() {

			var all_videos = $('iframe[src^="http://www.youtube.com"], object, embed');
			var all_video_images = $('.video-img');
			var all_video_buttons = $('.video-button-icon');

			var windowWidth = $(window).width();
			var newHeight = windowWidth * 0.5625;

			var scaleAmount = windowWidth / 1900;

			var minLargeBtnPerc = 0.23;
			var minSmallBtnPerc = 0.7; 

			var el;
			var centerX;
			var centerY; 

			all_videos.each(function() 
			{
				resizeElement( $(this), windowWidth, newHeight );
			});

			all_video_images.each(function() 
			{
				resizeElement( $(this), windowWidth, newHeight );
			});


			var largeBtnWidth = ( scaleAmount >= minLargeBtnPerc ) ? windowWidth : 1900 * minLargeBtnPerc;
			var largeBtnHeight = ( scaleAmount >= minLargeBtnPerc ) ? newHeight : 1070 * minLargeBtnPerc;
			all_video_buttons.each(function()
			{
				resizeElement( $(this), largeBtnWidth, largeBtnHeight );
				centerX = ( scaleAmount < minLargeBtnPerc ) ? Math.round(( windowWidth - largeBtnWidth ) * 0.5 ) : 0;
				centerY = ( scaleAmount < minLargeBtnPerc ) ? Math.round(( newHeight - largeBtnHeight ) * 0.5 ) : 0;
				$(this).css({"left":centerX,"margin-top":centerY});

	            $(this).parents('.play-button-mask').css({"height":newHeight});
			});


			var all_lightbox_play_btns = $('.lightbox-button-icon');
			all_lightbox_play_btns.each(function() 
			{
				scaleAmount = windowWidth / 1900;
				var isSecondVideo = $(this).parents('.second-video').length;
				/* Switch image in small lightbox at 579 breakpoint */
            	var imageURL = ( !isSecondVideo && windowWidth > 579 ) ? "./img/video-play-button-lbx-sml.png" : "./img/video-play-button-lbx-sml-579bp.png";
            	if(!isSecondVideo)	$('.lightbox-button-icon-sml').attr("src",imageURL);

				el = $(this);


				var imageWidth = ( isSecondVideo ) ? 980 : el.parents(el.parent).width();
				var imageHeight = ( isSecondVideo ) ? 552 : el.parents('.module-D').height(); 

				// el.parents('.play-button-mask').css({"height":imageHeight});
	            // Set play button image mask height
	            var secondVideoW = el.parents(el.parent).width();
	            var secondVideoH = Math.round( secondVideoW * 552 / 980 );
	            var maskHeight = ( isSecondVideo ) ? secondVideoH : imageHeight;
	            el.parents('.play-button-mask').css({"height":maskHeight});

				if( isSecondVideo && scaleAmount < minLargeBtnPerc ) scaleAmount = minLargeBtnPerc;
				if( !isSecondVideo && scaleAmount < minSmallBtnPerc ) scaleAmount = minSmallBtnPerc;

				var minSmallLbxWidth = Math.floor( 584 * minSmallBtnPerc );
				var minSmallLbxHeight = Math.floor( 386 * minSmallBtnPerc );
				var breakpointW = ( imageWidth < minSmallLbxWidth ) ? minSmallLbxWidth : imageWidth;
				var breakpointH = ( imageHeight < minSmallLbxHeight ) ? minSmallLbxHeight : imageHeight;
				var lbxWidth = ( isSecondVideo ) ? Math.floor( imageWidth * scaleAmount ) : breakpointW;
				var lbxHeight = ( isSecondVideo ) ? Math.floor( imageHeight * scaleAmount ) : breakpointH;
				centerX = Math.round( ( imageWidth - lbxWidth ) * 0.5 );
				centerY = Math.round( ( imageHeight - lbxHeight ) * 0.5 );

				if( windowWidth < imageWidth )
				{
					centerX = Math.round( ( windowWidth - lbxWidth ) * 0.5 );
					centerY = Math.round( ( ((windowWidth * imageHeight) / imageWidth ) - lbxHeight ) * 0.5 );
				}

				/*
				if( !isSecondVideo )
				{
					console.log('video.resizer.js - imageWidth: ', imageWidth);
					console.log('video.resizer.js - imageHeight: ', imageHeight);
					console.log('video.resizer.js - lbxWidth: ', lbxWidth);
					console.log('video.resizer.js - lbxHeight: ', lbxHeight);
					console.log('video.resizer.js - lbxHeight: ', lbxHeight);
				}
				*/
				// console.log('video.resizer.js - scaleAmount: '+scaleAmount+'; newWidth: '+newWidth+'; newHeight: '+newHeight+'; lbxWidth: '+lbxWidth+'; lbxHeight: '+lbxHeight+'; centerX: '+centerX+'; centerY: '+centerY);
				

				
				el.removeAttr( 'height' );
				el.removeAttr( 'width' );
			    el.height( lbxHeight );
				el.width( lbxWidth );
			    el.css({'left':centerX,'top':centerY});

			    if( !isSecondVideo )	console.log('video.resizer.js - scaleAmount: '+scaleAmount+'; windowWidth: '+windowWidth+'; newHeight: '+newHeight+'; lbxWidth: '+lbxWidth+'; lbxHeight: '+lbxHeight+'; centerX: '+centerX+'; centerY: '+centerY);
				
			});

			resizeElement = function( el, w, h )
			{
				// console.log('video.resizer.js - resizeElement() - el: ',el);
				el
					.removeAttr( 'height' )
					.removeAttr( 'width' )
					.width( w )
			    	.height( h )
			}


			// console.log('video.resizer.js - onWindowResize() - newWidth: '+newWidth+'; newHeight: '+newHeight);
			// console.log('video.resizer.js - scaleAmount: '+scaleAmount+'; newWidth: '+newWidth+'; newHeight: '+newHeight+'; lbxWidth: '+lbxWidth+'; lbxHeight: '+lbxHeight+'; lbxX: '+lbxX+'; lbxY: '+lbxY);
		})
		.resize();
})(jQuery);