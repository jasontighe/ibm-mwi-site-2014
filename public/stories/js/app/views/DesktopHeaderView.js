define(['jquery', 'hbs!templates/desktopHeader', 'backbone', 'marionette'],
    function ($, template, Backbone) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
          template:template,

          initialize: function(model){
             //this.model = model;
            console.log( 'DesktopHeaderView.initialize - model = ', this.model );

            if( typeof this.model != 'undefined' ) {
              console.log( 'DesktopHeaderView.initialize - showViewAllButton = ', this.model.get('showViewAllButton') );
              this.showViewAllButton = this.model.get('showViewAllButton');
            }

          },

          onShow: function() {

            if(this.showViewAllButton === true) {
              $('.view-all-button').show();
            }

            // Get platform info
            this.iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
            this.touch = !( $('html').hasClass('no-touch') );

            // Set on handler for mobile or desktop
            this.onHandler = ( this.touch /*&& !this.iOS*/ ) ? 'touchstart' : 'click';

            $('.view-all-button').on( this.onHandler, function(){

              // TRACKING -----------------------------------------------------------------------------
              var evgroup   = 'stories',
                  ev        = (window.location.hash !== '') ? window.location.hash : '#',
                  evaction  = 'click',
                  evname    = evgroup + '_' + ev + '_' + evaction + '_' +'view-all-button';

              IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);
              //---------------------------------------------------------------------------------------

              var hash = '#';
              window.location.hash = hash;

            });

          }

        });
    });