define(['jquery', 'hbs!templates/desktopFooter', 'backbone', 'marionette', 'models/Model'],
  function ($, template, Backbone, Marionette, Model) {
    //ItemView provides some default rendering logic
    return Backbone.Marionette.ItemView.extend({
      template:template,

      model: new Model(),

      initialize: function(){
       //console.log('DesktopFooter.initialize: collection',this.collection);
       var nav = this.collection.at(1).toJSON();
       var links = this.collection.at(2).toJSON();
       this.model.set(nav);
       this.model.set(links);
      },

      onShow: function() {
        console.log('DesktopFooter.onShow()' );

        this.iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
        this.touch = !( $('html').hasClass('no-touch') );
        this.onHandler = ( this.touch && !this.iOS ) ? 'touchstart' : 'click';

        this.setupFooterLinkHandlers();
      },

      setupFooterLinkHandlers: function(){
        //------------------------------------------------------
        // For homepage and voices html footer see sidebarNav.js
        //------------------------------------------------------
        $('.footer-link').on( this.onHandler, function(e) {

          var $el = $(e.currentTarget);
          var hash = $el.data('hash');

          // TRACKING -----------------------------------------------------------------------------
          var tracking  =  $el.data('tracking'),
              evgroup   = 'global',
              ev        = 'footer',
              evaction  = 'click',
              evname    = evgroup + '_' + ev + '_' + evaction + '_' +tracking;

          IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);
          //---------------------------------------------------------------------------------------

          console.log('hash', hash );
          if( typeof hash != 'undefined') {
            window.location.hash = hash;
          }
          //e.preventDefault();

        });


      },

      // View Event Handlers
      events: {

      }


    });
  });