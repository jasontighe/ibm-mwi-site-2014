define( ['App', 
          'backbone', 
          'marionette', 
          'jquery', 
          'handlebars',
          'hbs!templates/template', 
          'hbs!templates/template-1', 
          'hbs!templates/template-2', 
          'hbs!templates/template-3', 
          'hbs!templates/template-4', 
          'hbs!templates/template-5', 
          'hbs!templates/template-6', 
          'hbs!templates/template-7', 
          'hbs!templates/template-8', 
          'hbs!templates/template-9', 
          'hbs!templates/template-10', 
          'hbs!templates/template-11',
          'hbs!templates/template-footer',
          'hbs!templates/carousel-full',
          'hbs!templates/template-video', 
          'views/ModuleView', 
          'views/TemplateVideoView', 
          'collections/Modules', 
          'models/Model', 
          'bxslider',
          'youTubePlayer',
          'jqueryFancybox',
          'jqueryFancyboxMedia',
          'videoResizer',
          'pictureFill',
          'mobileCSSEnforcer'  ],
  function(App, 
           Backbone, 
           Marionette, 
           $,
           handlebars, 
           template,
           template1,
           template2,
           template3,
           template4,
           template5,
           template6,
           template7,
           template8,
           template9,
           template10,
           template11,
           templateFooter,
           carouselfull,
           templateVideo, 
           ItemView, 
           VideoItemView, 
           Modules, 
           Model, 
           bxslider,
           youTubePlayer,
           jqueryFancybox,
           jqueryFancyboxMedia,
           videoResizer ,
           pictureFill,
           mobileCSSEnforcer ) {
    //ItemView provides some default rendering logic
    return Backbone.Marionette.CompositeView.extend( {


      itemView: ItemView,
      // template: template,

      
      template: function( model )
      {
        var templateName = model.template_class;
        // console.log( "TemplateView: template() : model: ", model);
        // console.log( "TemplateView.initialize: story " + model.story_id + ", template " + model.template_class);

        // Handlebar custom helpers don't take variables, so had to inject a boolean if 'module_type' is carousel or notz
        for( i = 0; i < model.modules.length; i++ )
        {
            var module_type = model.modules[i].module_type;
            model.modules[i].isCarousel = ( module_type == 'carousel') ? true : false;

            // ADD "Learn More"COPY TO MODEL IF FOOTER-CAROUSEL Start.
            var module_class = model.modules[i].module_class;
            if( module_class.indexOf("carousel-footer") > -1) 
            {
              for( var j = 0; j < model.modules[i].assets.length; j++ )
              {
                model.modules[i].assets[j].learn_more_label = App.learn_more_label;
              }
            }
            // ADD "Learn More"COPY TO MODEL IF FOOTER-CAROUSEL End.
        }
        

        switch( templateName )
        {
          case 'template-1':
            template = template1( model );
            break;
          case 'template-2':
            template = template2( model );
            break;
          case 'template-3':
            template = template3( model );
            break;
          case 'template-4':
            template = template4( model );
            break;
          case 'template-5':
            template = template5( model );
            break;
          case 'template-6':
            template = template6( model );
            break;
          case 'template-7':
            template = template7( model );
            break;
          case 'template-8':
            template = template8( model );
            break;
          case 'template-9':
            template = template9( model );
            break;
          case 'template-10':
            template = template10( model );
            break;
          case 'template-11':
            template = template11( model );
            break;
          case 'template-footer':
            template = templateFooter( model );
            break;
          case 'carousel-full':
            template = carouselfull( model );
            break;
          case 'template-video':
            template = templateVideo( model );
            break;

          default:
            template = template;
        }
  
        return template;
      },

      
      // itemViewContainer: ".modules", // Commented out for now as the numbered templates don't have a .modules class - JPT

      initialize: function ( options ) {
        this.alphaOut = 0.6;
        this.alphaOver = 1;
        this.timeOut = 100;
        this.timeOver = 350;

        this.hasVideo = false;
        // console.log( "TemplateView: initialize() : App.learn_more_label: ", App.learn_more_label);

      },

      onShow: function() {
        var template_class = this.model.toJSON().template_class;

        if( template_class == 'template-video') 
        {
          var model = this.model.toJSON();
          var module_type = model.modules[0].module_type;

          // If there is no video, dont add.
          if( module_type === "" ) return;

          this.hasVideo = true;
          this.initVideo();
          this.addVideoButtonIcon();
        }
        else
        {
          this.checkForCarousel();
          this.initLightbox();
        }
      },

      emptyMethod: function() {
      },


      /**************************************
      / CAROUSEL
      /*************************************/
      checkForCarousel: function()
      {
        var model = this.model.toJSON();
        var i = 0;
        var I = model.modules.length;
        for( i; i < I; i++)
        {
          if( model.modules[i].module_type == "carousel" )
          {
            this.initCarouselAt( i );
          }
        }
      },

      initCarouselAt: function(index) 
      {
        var model = this.model.toJSON();
        var template = model.template_class;
        var wrapperClass = model.modules[index].wrapper_class;
        var selector = '#s' + model.story_id + '-' + wrapperClass;
        // console.log( "TemplateView: initCarouselAt() - index: ",index );
        //console.log( "TemplateView: initCarouselAt() - template: ",template );
        // console.log( "TemplateView: initCarouselAt() - selector: ",selector );
        
        var options;
        var hidePager = (model.modules[index].assets.length === 1) ? false : true;

        if( template === "template-footer" )
        {
          options = {
              maxSlides: 2,
              moveSlides: 1,
              pager: hidePager,
              touchEnabled: hidePager
          };
        }
        else
        {
          options = {
              pager: hidePager,
              touchEnabled: hidePager
          };
        } 

        this.bxSlider = $(selector).bxSlider( options ); 
        this.addCarouselTracking(index);
      },
      

      addCarouselTracking: function(index) 
      {
        this.prevCount = 0;
        this.nextCount = 0;
        this.pagerCounts = [];

        var model = this.model.toJSON();
        var i = 0;
        var I = model.modules[index].assets.length;
        for( i; i < I; i++ )
        {
          this.pagerCounts.push({"count": 0});
        }
      },

      /**************************************
      / VIDEO
      /*************************************/
      initVideo: function() 
      {
        // Hide video
        $('.youtube-player').hide();
      },

      addVideoButtonIcon: function()
      {
        var windowWidth = $(window).width();
        var newHeight = windowWidth * 0.5625;

        var selector = "#video-button-" + this.model.toJSON().modules[0].assets[ 0 ].hyperlink;
        var iconId = "video-button-icon-" + this.model.toJSON().modules[0].assets[ 0 ].hyperlink;

        $(selector).prepend('<img class="level-1 video-button-icon" id="'+iconId+'" src="./img/video-play-button.png" />');    
        $('#'+iconId).fadeTo( 0, this.alphaOut );

        $('#'+iconId).wrap('<div class="play-button-mask">');
        $('#'+iconId).parents('.play-button-mask').css({"height":newHeight});

        /*
        if (document.documentMode == 9) 
        {
          alert( 'IE 9: windowWidth: '+windowWidth+', newHeight: '+newHeight ); 
        }
        */

        var scaleAmount = windowWidth / 1900;
        var minLargeBtnPerc = 0.23;

        /* If small screensize, make sure the min size for the playbutton is set */
        if( scaleAmount < minLargeBtnPerc )
        {
          var largeBtnWidth = 1900 * minLargeBtnPerc;
          var largeBtnHeight = 1070 * minLargeBtnPerc;
          var centerX = Math.round(( windowWidth - largeBtnWidth ) * 0.5 );
          var centerY = Math.round(( newHeight - largeBtnHeight ) * 0.5 );

          var el = $('#'+iconId);
          el
            .removeAttr( 'height' )
            .removeAttr( 'width' )
            .width( largeBtnWidth )
            .height( largeBtnHeight )
            .css({'left':centerX,'margin-top':centerY});
        }
      },

      playVideo: function() 
      {
        var container= this.model.toJSON().modules[0].assets[ 0 ].hyperlink;
        var videoId= this.model.toJSON().modules[0].assets[ 0 ].hyperlink;
        var wrapperId = '#video-button-' + this.model.toJSON().modules[0].assets[ 0 ].hyperlink;
        var w;
        var h;

        // Firefox is not getting scaled size. 
        var viewportDifference = Math.abs( $(wrapperId).outerWidth() - $(window).width() );
        if( viewportDifference > 10 )
        {
          w = $(window).width();
          h = Math.round( w * 0.5625 ); // images are always 16:9 ratio (0.5625)
        }
        else
        {
          w = $(wrapperId).outerWidth();
          h = $(wrapperId).height();
        }

        this.player = youTubePlayer;
        this.player.playVideo( container, videoId, w, h );

        // off/on to reset listener
        App.off('VideoEvent.COMPLETE'+'-'+videoId, this.onVideoComplete, this );
        App.on('VideoEvent.COMPLETE'+'-'+videoId, this.onVideoComplete, this );

      },


      toggleVideoViews: function(videoId) 
      {
        console.log( "TemplateView: toggleVideoViews() : videoId ", videoId);
        var playBtnId = '#video-button-' + videoId; //temp using this instead so i can use wrapper for image
        var youtubeId = '#' + videoId;
        $(playBtnId).toggle();
        $(youtubeId).toggle();
      },

      /**************************************
      / FANCYBOX LIGHTBOX
      /*************************************/
      initLightbox: function()
      {
        var model = this.model.toJSON();
        var i = 0;
        var I = model.modules.length;
        for( i; i < I; i++)
        {
          moduleType = model.modules[i].module_type;
          // console.log( ":::::::::: TemplateView: initCarousel() - moduleType: ",moduleType );

          var self = this;
          if( moduleType == "lightbox" )
          {

            // WRAP Hyperlink around image
            var wrapper_class = this.model.toJSON().modules[i].wrapper_class;
            var story_id = this.model.toJSON().story_id;
            var videoId = this.model.toJSON().modules[i].assets[ 0 ].hyperlink;
            var url = 'http://www.youtube.com/watch?v=' + videoId + '?autoplay=1&enablejsapi=1'; 
            var selector = '#s'+story_id+'-'+wrapper_class+'-alt';
            var iconId = "lightbox-button-icon-" + this.model.toJSON().modules[0].assets[ 0 ].hyperlink;


            var windowWidth = $(window).width();
            var scaleAmount = windowWidth / 1900;

            /* Select appropriate play button image */
            var imageURL; // = ( wrapper_class === "tv-mA" ) ? "./img/video-play-button-lbx-lrg.png" : "./img/video-play-button-lbx-sml.png";
            var isSecondVideo = (wrapper_class === "tv-mA") ? true : false;

            if( !isSecondVideo && windowWidth < 580 )
            {
              imageURL = "./img/video-play-button-lbx-sml-579bp.png";
            } 
            else if( isSecondVideo )
            {
              imageURL = "./img/video-play-button-lbx-lrg.png";
            }
            else
            {
              imageURL = "./img/video-play-button-lbx-sml.png";
            }

            var extraClass = (isSecondVideo) ? '' : 'lightbox-button-icon-sml'; // Extra class for small lightbox to easily target them
            $(selector).prepend('<img class="level-1 lightbox-button-icon '+extraClass+'" id="'+iconId+'" src="'+imageURL+'" />');    
            $('#'+iconId).fadeTo( 0, this.alphaOut );


            $('#'+iconId).wrap('<div class="play-button-mask">');


            // Resize play button image and center
            var imageWidth = ( isSecondVideo ) ? 980 : $('#'+iconId).parents($('#'+iconId).parent).width();
            var imageHeight = ( isSecondVideo ) ? 552 : Math.round(386 * imageWidth / 584); // otherwise height() is 1px

            // Set play button image mask height
            var secondVideoW = $('#'+iconId).parents($('#'+iconId).parent).width();
            var secondVideoH = Math.round( secondVideoW * 552 / 980 );
            var maskHeight = ( isSecondVideo ) ? secondVideoH : imageHeight;
            $('#'+iconId).parents('.play-button-mask').css({"height":maskHeight});

            var minLargeBtnPerc = 0.23;
            var minSmallBtnPerc = 0.7; 


            if( isSecondVideo && scaleAmount < minLargeBtnPerc ) scaleAmount = minLargeBtnPerc;

            var minSmallLbxWidth = Math.floor( 584 * minSmallBtnPerc );
            var minSmallLbxHeight = Math.floor( 386 * minSmallBtnPerc );
            var breakpointW = ( imageWidth < minSmallLbxWidth ) ? minSmallLbxWidth : imageWidth;
            var breakpointH = ( imageHeight < minSmallLbxHeight ) ? minSmallLbxHeight : imageHeight;

            var lbxWidth = ( isSecondVideo ) ? Math.round( imageWidth * scaleAmount ) : breakpointW;
            var lbxHeight = ( isSecondVideo ) ? Math.round( imageHeight * scaleAmount ) : breakpointH;

            var lbxX = Math.round( ( imageWidth - lbxWidth ) * 0.5 );
            var lbxY = Math.round( ( imageHeight - lbxHeight ) * 0.5 );
            
            if( windowWidth < imageWidth )
            {
              lbxX = Math.round( ( windowWidth - lbxWidth ) * 0.5 );
              lbxY = Math.round( ( ((windowWidth * imageHeight) / imageWidth ) - lbxHeight ) * 0.5 );
            }

            $('#'+iconId)
              .removeAttr( 'height' )
              .removeAttr( 'width' )
              .width( lbxWidth )
              .height( lbxHeight )
              .css({left: lbxX,top: lbxY});

            /*
            console.log( "TemplateView: initLightbox() - wrapper_class: ", wrapper_class );
            console.log( "TemplateView: initLightbox() - scaleAmount: ", scaleAmount );
            console.log( "TemplateView: initLightbox() - isSecondVideo: ", isSecondVideo );
            console.log( "TemplateView: initLightbox() - imageURL: ", imageURL );
            console.log( "TemplateView: initLightbox() - imageWidth: ", imageWidth );
            console.log( "TemplateView: initLightbox() - imageHeight: ", imageHeight );
            console.log( "TemplateView: initLightbox() - videoId: ", videoId );
            console.log( "TemplateView: initLightbox() - selector: ", selector );
            console.log( "TemplateView: initLightbox() - lbxWidth: ", lbxWidth );
            console.log( "TemplateView: initLightbox() - lbxHeight: ", lbxHeight );
            console.log( "TemplateView: initLightbox() - lbxX: ", lbxX );
            console.log( "TemplateView: initLightbox() - lbxY: ", lbxY );
            console.log( "TemplateView: initLightbox() - secondVideoW: ", secondVideoW );
            console.log( "TemplateView: initLightbox() - secondVideoH: ", secondVideoH );
            console.log( "TemplateView: initLightbox() - $(selector): ", $(selector) );
            */

            $(selector).wrap('<a href="'+url+'" class="fancybox-media lightbox-link">');
            this.videoId = videoId;
            this.addLightbox( videoId );
          }
        }  
      },


      addLightbox: function(videoId)
      {
        $('.fancybox-media')
        .attr('rel', 'media-gallery')
        .fancybox({
          padding: 0,
          openEffect : 'none',
          closeEffect : 'none',
          prevEffect : 'none',
          nextEffect : 'none',
          videoId: this.videoId,
          beforeShow  : function() {
              // Find the iframe ID
              
              var id = $.fancybox.inner.find('iframe').attr('id');

              // Create video player object and add event listeners
              this.player = new YT.Player(id, 
              {
                  events: 
                  {
                      'onStateChange': function(event) 
                      {

                        var evgroup;
                        var  ev;
                        var  evaction;
                        var  evname;

                        // console.log( ":::::::::: TemplateView: LIGHTBOX VIDEO FINISHED(): event.target.videoId ",event.target.videoId);
                        if (event.data === 0) 
                        {
                            // TRACKING -----------------------------------------------------------------------------
                              evgroup = 'stories';
                              ev      =  (window.location.hash !== '') ? window.location.hash : '#';
                              evaction= 'videocomplete';
                              evname  = evgroup + '_' + ev + '_' + evaction  + '_'  + event.target.videoId;

                            IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );




                            //---------------------------------------------------------------------------------------
                        }
                        else if(event.data === 1 )
                        {
                          // TRACKING -----------------------------------------------------------------------------
                            evgroup = 'stories';
                            ev      =  (window.location.hash !== '') ? window.location.hash : '#';
                            evaction= 'videoplay';
                            evname  = evgroup + '_' + ev + '_' + evaction + '_' + event.target.videoId;

                          IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );
                          //---------------------------------------------------------------------------------------
                        }
                     }
                  }

              });
              this.player.videoId = videoId;
              
          },

          arrows : false,
          helpers : {
            media : {},
            buttons : {}
          }
        });

      },

      doClickTracking: function( id, count, desc )
      {
        // TRACKING -----------------------------------------------------------------------------
        evgroup = 'stories';
        ev      =  (window.location.hash !== '') ? window.location.hash : '#';
        evaction= 'click';
        evname  = evgroup + '_' + ev + '_' + evaction + '_' + id + '-' + desc + '-' + count;

        IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );
        //---------------------------------------------------------------------------------------
      },

      doCarouselSocialTracking: function( url, template )
      {
        var story_id = this.model.toJSON().story_id;

        // TRACKING -----------------------------------------------------------------------------
        evgroup   = 'stories';
        ev      =  (window.location.hash !== '') ? window.location.hash : '#';
        evaction  = 'share';
        evname    = evgroup + '_' + ev + '_' + evaction + '_s' + story_id + template + '_' + url;

        IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);
        //---------------------------------------------------------------------------------------
      },

      doLearnMoreTracking: function( url, template )
      {
        var story_id = this.model.toJSON().story_id;

        // TRACKING -----------------------------------------------------------------------------
        evgroup   = 'stories';
        ev      =  (window.location.hash !== '') ? window.location.hash : '#';
        evaction  = 'share';
        evname    = evgroup + '_' + ev + '_' + evaction + '_s' + story_id + template + '_' + url;

        IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);
        //---------------------------------------------------------------------------------------
      },

      doCatchAllTracking: function( url, template )
      {
        var story_id = this.model.toJSON().story_id;

        // TRACKING -----------------------------------------------------------------------------
        evgroup   = 'stories';
        ev      =  (window.location.hash !== '') ? window.location.hash : '#';
        evaction  = 'click';
        evname    = evgroup + '_' + ev + '_' + evaction + '_s' + story_id + template + '_' + url;

        IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);
        //---------------------------------------------------------------------------------------
      },


      /**************************************
      / EVENTS
      /*************************************/
      events: {
        "mouseover .video-button": "onVideoBtnOver",
        "mouseout .video-button": "onVideoBtnOut",
        "click .video-button": "onVideoBtnClick",
        "click .fancybox-media": "onLightboxClick",
        "mouseover .lightbox-link": "onLightboxBtnOver",
        "mouseout .lightbox-link": "onLightboxBtnOut",
        "click .bx-prev": "onPrevClick",
        "click .bx-next": "onNextClick",
        "click .linkedin": "onLinkedInClick",
        "click .twitter": "onTwitterClick",
        "click .bx-pager-link": "onPagerItemClick",
        'click a': 'clickCatchAll',
        "orientationchange window": "onOrientationChange"
      },

      /**************************************
      / EVENT HANDLERS
      /*************************************/
      onVideoBtnOver: function(e)
      {
        var selector = "#video-button-icon-" + this.model.toJSON().modules[0].assets[ 0 ].hyperlink;
        $(selector).fadeTo( this.timeOver, this.alphaOver );
      },
      onVideoBtnOut: function(e)
      {
        var selector = "#video-button-icon-" + this.model.toJSON().modules[0].assets[ 0 ].hyperlink;
        $(selector).fadeTo( this.timeOut, this.alphaOut );
      },
      onVideoBtnClick: function(e)
      {
        var videoId = this.model.toJSON().modules[0].assets[ 0 ].hyperlink;
        console.log( ":::::::::: TemplateView: onVideoBtnClick() videoId="+videoId);

        if ( typeof videoId === 'undefined' || videoId === '' ) return;

        this.toggleVideoViews(videoId);
        this.playVideo();

        // TRACKING -----------------------------------------------------------------------------
        var evgroup = 'stories',
        ev      =  (window.location.hash !== '') ? window.location.hash : '#',
          evaction= 'videoplay',
          evname  = evgroup + '_' + ev + '_' + evaction + '_' + videoId;

        IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );
        //---------------------------------------------------------------------------------------
      },
      onVideoComplete: function(e)
      {
        console.log( ":::::::::: TemplateView: onVideoComplete() e: ");
        var videoId = e;
        this.toggleVideoViews(videoId);

        // TRACKING -----------------------------------------------------------------------------
        var evgroup = 'stories',
        ev      =  (window.location.hash !== '') ? window.location.hash : '#',
          evaction= 'videocomplete',
          evname  = evgroup + '_' + ev + '_' + evaction  + '_'  + videoId;

        IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );
        //---------------------------------------------------------------------------------------
      },

      // Lightbox
      onLightboxClick: function(e)
      {
        e.preventDefault();
        App.YTPlayer.stopAllPlayers();
      },
      onLightboxBtnOver: function(e)
      {
        var selector = "#lightbox-button-icon-" + this.model.toJSON().modules[0].assets[ 0 ].hyperlink;
        $(selector).fadeTo( this.timeOver, this.alphaOver );
      },
      onLightboxBtnOut: function(e)
      {
        var selector = "#lightbox-button-icon-" + this.model.toJSON().modules[0].assets[ 0 ].hyperlink;
        $(selector).fadeTo( this.timeOut, this.alphaOut );
      },

      // Footer Carousel
      onPrevClick: function(e)  
      {
        this.prevCount++;
        var id = this.bxSlider.attr('id').split('-').join('');
        this.doClickTracking( id, this.prevCount, 'left'); 
        e.preventDefault();
      },
      onNextClick: function(e)
      {
        this.nextCount++;
        var id = this.bxSlider.attr('id').split('-').join('');
        this.doClickTracking( id, this.nextCount, 'right'); 
        e.preventDefault();
      },
      onPagerItemClick: function(e)
      {
        var index = Number($(e.target).attr('data-slide-index'));
        var count = Number(this.pagerCounts[ index ].count);
        count++;
        this.pagerCounts[ index ].count = count;
        var id = this.bxSlider.attr('id').split('-').join('');
        index++;
        this.doClickTracking( id, count, 'dot'+index); 
        e.preventDefault();
      },
      onLinkedInClick: function(e)
      {
        var url = e.target.href;
        var template_tracking = this.model.toJSON().template_tracking;
        this.doCarouselSocialTracking(url, template_tracking);
      },
      onTwitterClick: function(e)
      {
        var url = e.target.href;
        var template_tracking = this.model.toJSON().template_tracking;
        this.doCarouselSocialTracking(url, template_tracking);
      },

      // Catch all a tag tracking handler
      clickCatchAll: function(e)
      {
        var target = e.target;
        var targetClass = $(e.target).attr('class');
        var url = e.target.href;
        var template_tracking = this.model.toJSON().template_tracking;

        // Filter out a tags that already have tracking
        if((targetClass.toLowerCase().indexOf("lightbox-button-icon") >= 0) ||
           (targetClass.toLowerCase().indexOf("bx-next") >= 0) ||
           (targetClass.toLowerCase().indexOf("bx-prev") >= 0) ||
           (targetClass.toLowerCase().indexOf("bx-pager-link") >= 0) ||
           (targetClass.toLowerCase().indexOf("linkedin") >= 0) ||
           (targetClass.toLowerCase().indexOf("twitter") >= 0))
        {
          return;
        }
        else
        {
          this.doCatchAllTracking(url, template_tracking);
        }
      },

      onOrientationChange: function(e)
      {
        console.log( ":::::::::: TemplateView: onOrientationChange() e: ",e);
        /*
        console.log( ":::::::::: TemplateView: onOrientationChange() e.data: ",e.data);
        console.log( ":::::::::: TemplateView: onOrientationChange() e.orientation: ",e.orientation);
        */
      }
      
    });
  });