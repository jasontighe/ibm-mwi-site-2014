define( ['App', 'backbone', 'marionette', 'jquery', 'hbs!templates/story', 'views/TemplateView', 'collections/Templates', 'jquerySticky'],
    function(App, Backbone, Marionette, $, template, ItemView, Templates, jquerySticky) {
      //ItemView provides some default rendering logic
      return Backbone.Marionette.CompositeView.extend( {
        template: template,
        itemView: ItemView,
        itemViewContainer: ".templates",

        itemViewOptions : function () {
          return { storyId: this.model.id };
        },

        setCollection: function() {
          // this array of templates, nested within the story JSON data, represents
          //  a new collection to be rendered as models using TemplateView
          var model = this.model.get("templates");
          for( var i = 0; i < model.length; i++ )
          {
            model[i].story_id =  this.model.id;
          }
          var templatesCollection = new Templates(model);
          this.collection = templatesCollection;
        },

        initialize: function (options) {

          // Add truncated company string for mobile.
          var company = this.model.toJSON().company;
          var maxChar = 24;
          var company_trunc =  (company.length > maxChar ) ? $.trim(company).substring(0, maxChar) + '...' : company;
          this.model.set({'company_trunc':company_trunc});
          
          this.lazyLoadMaxItems = options.lazyLoadMaxItems;
          this.lazyLoadItemIndex = options.lazyLoadItemIndex;
          this.model.set({'lazyLoadItemIndex':this.lazyLoadItemIndex});
          //console.log('this.lazyLoadMaxItems = '+this.lazyLoadMaxItems);

          if ( this.lazyLoadItemIndex < (this.lazyLoadMaxItems) ){
            this.setCollection();
            console.log('StoryView.initialize - collection:', this.collection );
            this.model.set({'visible': true});
            this.model.set({'deferRender': false});
          }
          else {
            console.log('StoryView.initialize - deferred');
            this.model.set({'visible': false});
            this.model.set({'deferRender': true});
          }
          console.log( 'this.lazyLoadItemIndex = '+this.lazyLoadItemIndex);
          console.log( 'StoryId = '+this.model.id);

          this.socialTrayVisible = false;
        },

        updateMobileIcons: function() {
            if( App.isIOs() )
            {
              $('.device-icon-android').hide();
            }
            else
            {
              $('.device-icon-ios').hide();
            }
        },

        deferredRender: function() {
          console.log('StoryView.deferredRender()');

          var deferred = this.model.get('deferRender');
          if ( deferred === false ) {
            this.showItemView(); // item lazy loaded then hidden and then 'show more' button clicked again
          } else {
            // lazy load item on 'show more' button click
            this.model.set({'deferRender': false});
            this.setCollection();
            this.render();
            this.onShow();
          }
        },

        onRender: function() {
          console.log('StoryView.onRender');

        },

        onShow: function() {
          //console.log('StoryView.onShow()', this.model.id );

          var id = this.model.id;
          var header = $("#story-header-"+id);
          var headerTop = 60;
          var headerHeight = header.height();
          var headerBottom = headerTop + headerHeight;

          var selector = '#story-'+id;

          // INITIALLY HIDDEN (ITEM INDEX ABOVE LAZY LOAD MAX ITEM LIMIT)
          if ( this.model.get('deferRender') === true && this.model.get('visible') === false ) {

            $(selector).removeClass('story-waypoint'); // remove class to prevent false firing of story scroll tracking
            console.log('removeClass',$(selector));

            $(selector).hide();
            console.log('StoryView.onShow - hide:'+ selector );

          }

          // DEFERRED RENDER CALLED ON INITIALLY HIDDEN ITEM
          else if( this.model.get('deferRender') === false && this.model.get('visible') === false ) {
            console.log('StoryView.onShow() - deferred '+ selector);

            $(selector).show();
            this.model.set({'visible': true});

            header.sticky({ topSpacing: headerTop });

            $(selector).addClass('story-waypoint'); // add class to enable story scroll tracking
            console.log('addClass',$(selector));

            // update scroll tracking to add new story
            IBMMasters.tracking.updateScrollWaypoints(selector);

            this.attachSocialShareHandlers();

            App.YTPlayer.stopAllPlayers(); // stop any youtube videos that are playing
          }

          // INITIALLY SHOWN (ITEM INDEX BELOW LAZY LOAD MAX ITEM LIMIT)
          else {
            console.log('StoryView.onShow - show:'+ selector );
            header.sticky({ topSpacing: headerTop });
            this.attachSocialShareHandlers();

          }

          this.updateMobileIcons();
        },

        hideItemView: function() {
          var selector = '#story-'+this.model.id;
          console.log("StoryView.hideItemView: "+selector);
          $(selector).hide();
          this.model.set({'visible': false});
        },

        showItemView: function() {
          var selector = '#story-'+this.model.id;
          console.log("StoryView.showItemView: "+selector);
          $(selector).show();
          this.model.set({'visible': true});
        },

        attachSocialShareHandlers: function(){

          var selector = '#story-'+this.model.id;
          var that = this;
          $(selector).find('.story-header-title .twitter').on('click', function(e){
            IBMMasters.tracking.trackSocialShare('twitter', that.model.id );
          });
          $(selector).find('.story-header-title .facebook').on('click', function(e){
            IBMMasters.tracking.trackSocialShare('facebook', that.model.id );
          });
          $(selector).find('.story-header-title .linkedin').on('click', function(e){
            IBMMasters.tracking.trackSocialShare('linkedin', that.model.id );
          });

        },

        toggleMobileSocialTray: function() 
        {
          var timeIn = 1;
          var timeOut = 1;

          console.log( "StoryView.toggleStoryTitle - this.socialTrayVisible: ", this.socialTrayVisible );
          var that = this;
          var selector = '#story-'+this.model.id;
          var storyTitle = $(selector).find('.story-title-trunc');
          var socialTray = $(selector).find('.story-header-mobile');
          if ( this.socialTrayVisible === false ) {
            socialTray.css( 'overflow', 'visible');
            TweenLite.to( storyTitle, timeIn, { x:-300, ease:"Quad.easeOut", onComplete:function(){ that.socialTrayVisible = true; } });
            TweenLite.to( socialTray, timeIn, { x: -150, ease:"Quad.easeOut" });
          } 
          else 
          {
            TweenLite.to( storyTitle, timeOut, { x:0, ease:"Quad.easeOut", onComplete:function(){ that.socialTrayVisible = false; }});
            TweenLite.to( socialTray, timeOut, { x:0, ease:"Quad.easeOut", onComplete:function(){ socialTray.css( 'overflow', 'hidden'); }});
          }
        },


        /**************************************
        / EVENTS
        /*************************************/
        events: {
          "click .mobile-device-icons a": "onDeviceIconClick"
        },

        /**************************************
        / EVENT HANDLERS
        /*************************************/
        onDeviceIconClick: function(e)
        {
          console.log( "StoryView.onDeviceIconClick");
          e.preventDefault();
          this.toggleMobileSocialTray();
        }
      });
    });