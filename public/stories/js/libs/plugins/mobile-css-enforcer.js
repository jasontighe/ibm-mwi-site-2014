define(['jquery', '../libs/plugins/jquery.bxslider.js'], function( $, bxslider) 
{		

  MobileCSSEnforcer =
  { 
  	onOrientationChange: function() 
  	{
  		var isAndroid = /Android/i.test(navigator.userAgent);

	  	$(window).on("orientationchange",function(event)
		{
			//	alert("General Orientation is: " + event.orientation + ", Screen width: " +$(window).width() + ", this.orientation: "+this.orientation+ ", isAndroid: "+isAndroid); 
			if( $(window).width() <= 640 && isAndroid )
			{
				MobileCSSEnforcer.reloadPage();
			}

			/*
			if (typeof( event.orientation ) === "undefined")
			{
				if (window.orientation == -90 || window.orientation == 90 ) 
				{
			        this.orientation = "landscape";
			        if( $(window).width() === 640 )
			        {
						alert("LANDSCAPE Orientation is: " + event.orientation + ", Screen width: " +$(window).width() + ", this.orientation: "+this.orientation+ ", isAndroid: "+isAndroid); 
						// MobileCSSEnforcer.reloadPage();
			        }
			    } 
			    else 
			    {
			        this.orientation = "portrait";
			        if( $(window).width() === 360 )
			        {
						alert("PORTRAIT Orientation is: " + event.orientation + ", Screen width: " +$(window).width() + ", this.orientation: "+this.orientation+ ", isAndroid: "+isAndroid); 
						// MobileCSSEnforcer.reloadPage();
			        }
			    }
			}
			*/
		});
	},
	
  	reloadFooterSlider: function() 
  	{
  		/* BxSlider is undefined
  		console.log("MOBILE-CSS-ENFORCER.reloadFooterSlider()" );
  		console.log("MOBILE-CSS-ENFORCER.reloadFooterSlider() - bxslider: ",bxslider );
  		var slider = $('.carousel-footer .bxslider').bxSlider();
  		console.log("MOBILE-CSS-ENFORCER.reloadFooterSlider() - slider: ",slider );
  		*/
  	},

  	reloadPage: function()
  	{
  		location.reload();
  	},
	
  	updateCSSLandscape: function() 
  	{
		$('#ibm-content .postcard .ibm-columns .template-footer').attr('style', 'height: 460px !important;');
		$('#ibm-content .postcard .ibm-columns .carousel-footer .bx-wrapper').attr('style', 'width: 460px !important; height: 280px !important;');
		$('#ibm-content .postcard .ibm-columns .carousel-footer .bx-viewport').attr('style', 'width: 460px !important; height: 260px !important; overflow: hidden !important;');
		$('.bx-viewport .tF-mD1').attr('style','width: 448px !important; height: 320px !important; margin: 0 20px 0 0 !important;');
		$('.carousel-footer .bx-wrapper .bx-pager').attr('style', 'width: 600px !important;');
		$('.carousel-footer .bx-wrapper .bx-next').attr('style', 'right: -125px !important;');
		$('.footer-title').attr('style', 'width: 450px !important;');
		$('.footer-desc').attr('style', 'width: 450px !important;');
		$('.carousel-footer .bxslider').attr('style', 'height: 0px !important;');
  	},
	
  	updateCSSPortrait: function() 
  	{
		$('#ibm-content .postcard .ibm-columns .template-footer').attr('style', 'height: 600px !important;');
		$('#ibm-content .postcard .ibm-columns .carousel-footer .bx-wrapper').attr('style', 'width: 100% !important; height: 380px !important;');
		$('#ibm-content .postcard .ibm-columns .carousel-footer .bx-viewport').attr('style', 'width: 315px !important; height: 360px !important; overflow: hidden !important;');
		$('.bx-viewport .tF-mD1').attr('style','width: 300px !important; height: 380px !important; margin: 0 20px 0 0 !important;');
		$('.carousel-footer .bx-wrapper .bx-pager').attr('style', 'width: 315px !important;');
		$('.carousel-footer .bx-wrapper .bx-next').attr('style', 'right: 8% !important;');
		$('.footer-title').attr('style', 'width: 300px !important;');
		$('.footer-desc').attr('style', 'width: 300px !important;');
		$('.carousel-footer .bxslider').attr('style', 'height: 0px !important;');
  	}
};

	MobileCSSEnforcer.onOrientationChange();

  	return  MobileCSSEnforcer;
});