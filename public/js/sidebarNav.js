var IBMMasters = IBMMasters || {};

/**
 * Namespace function, safely creates a namespace without clobbering existing objects
 * @param {String} namespace A string in the form of 'IBMMobileFirst.SE.package.subpackage'
 * @returns {Object}
 */
IBMMasters.namespace = function(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';
    for (var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
    return parent;
};


(function($) {
      	
    IBMMasters.namespace('IBMMasters.sidebarNav');
    IBMMasters.sidebarNav = {

    	init: function() {
    		console.log('IBMMasters.sidebarNav.init');
        $(document).ready(function() {

          // Disable 300 ms lag on iOS click events
          FastClick.attach(document.body);

          IBMMasters.sidebarNav.onReady();
        });
	    },

      onReady: function() {
        console.log('IBMMasters.sidebarNav.onReady');

        // For Android use 'touchstart'
        // For Desktop use 'click'
        // For iOS use 'click' with fastclick.js

        this.iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
        this.touch = !( $('html').hasClass('no-touch') );
        this.onHandler = ( this.touch && !this.iOS ) ? 'touchstart' : 'click';

        console.log('this.iOS = ', this.iOS);
        console.log('this.touch = ', this.touch);
        console.log('this.onHandler = ', this.onHandler);

        this.menuOpen = 'false';
        this.closeEnabled = 'false';

        this.setupFilterListToggles();
        this.createScrollbar();
        this.attachEventHandlers();

        // resize scrollbar on window resize
        $( window ).resize(function() {
          IBMMasters.sidebarNav.refreshScrollbar();
        });

        //-----------------------------------------------------
        // SET UP FOOTER NAV - no time to create another file
        //-----------------------------------------------------
        this.setUpFooterNav();

      },

      setupFilterListToggles: function() {

        var filterListToggleBtn = $('.filter-list-toggle');
        var filterListSubmenuToggleBtns = $('.filter-list-submenu-toggle');
        var submenus = $('.filter-list-submenu');

        // SET UP MAIN FILTER LIST TOGGLE BUTTON
        filterListToggleBtn.on(this.onHandler, function(e){

          if( filterListToggleBtn.hasClass('open') ) {
            filterListSubmenuToggleBtns.each( function(){
              $(this).removeClass('show');
              $(this).removeClass('open')
            });
            filterListToggleBtn.removeClass('open');
            submenus.removeClass('open');

            // TRACKING -----------------------------------------------------------------------------
            IBMMasters.tracking.trackCustomEvent('global', 'nav', 'collapse', 'global_nav_collapse_filters');
            //---------------------------------------------------------------------------------------
          } else {
            filterListSubmenuToggleBtns.each( function(){ $(this).addClass('show') });
            filterListToggleBtn.addClass('open');

            // Open first filter submenu
            //filterListSubmenuToggleBtns.eq(0).addClass('open');
            //$('#capability').addClass('open');

            // TRACKING -----------------------------------------------------------------------------
            IBMMasters.tracking.trackCustomEvent('global', 'nav', 'expand', 'global_nav_expand_filters');
            //---------------------------------------------------------------------------------------
          }
          IBMMasters.sidebarNav.refreshScrollbar();
        });

        // SET FILTER SUBMENU TOGGLE BUTTONS
        filterListSubmenuToggleBtns.on(this.onHandler, function(e) {
          var thisButton = $(e.currentTarget);
          var submenuId  = thisButton.data('submenu');
          var evname;
          if( thisButton.hasClass('open') ) {
            thisButton.removeClass('open');
            $(submenuId).removeClass('open');

            // TRACKING -----------------------------------------------------------------------------
            evname =  'global_nav_collapse_' + thisButton.data('submenu').replace('#','');
            IBMMasters.tracking.trackCustomEvent('global', 'nav', 'collapse', evname);
            //---------------------------------------------------------------------------------------
          } else {
            thisButton.addClass('open');
            $(submenuId).addClass('open');

            // TRACKING -----------------------------------------------------------------------------
            evname =  'global_nav_expand_' + thisButton.data('submenu').replace('#','');
            IBMMasters.tracking.trackCustomEvent('global', 'nav', 'expand', evname);
            //---------------------------------------------------------------------------------------
          }
          IBMMasters.sidebarNav.refreshScrollbar();
        });
      },

      resetFilterListTogglesAndSubmenus: function() {
        console.log('resetFilterListTogglesAndSubmenus');
        var filterListToggleBtn = $('.filter-list-toggle');
        var filterListSubmenuToggleBtns = $('.filter-list-submenu-toggle');
        var submenus = $('.filter-list-submenu');

        if( filterListToggleBtn.hasClass('open') ) {
          filterListSubmenuToggleBtns.each( function(){
            $(this).removeClass('show');
            $(this).removeClass('open')
          });
          filterListToggleBtn.removeClass('open');
          submenus.removeClass('open');
        }
      },

      setScrollbarHeight: function() {
        var windowHeight = $(window).height();
        $('.iscroller').css('height', windowHeight);
      },

      createScrollbar: function() {
        IBMMasters.sidebarNav.setScrollbarHeight();
        // https://github.com/cubiq/iscroll/ 
        IBMMasters.sidebarNav.iScroll = new IScroll('.iscroller', {
          mouseWheel: true,
          scrollbars: true
        });
      },

      refreshScrollbar: function() {
        IBMMasters.sidebarNav.setScrollbarHeight();
        IBMMasters.sidebarNav.iScroll.refresh();
      },

      enableCloseButton: function() {
        console.log('delayed call: enableCloseButtonOnTouch');
        IBMMasters.sidebarNav.closeEnabled = 'true';
      },

      slideOpenSidebarNav: function() {
        TweenLite.to( $('.bars'), 0.20, {right: 360, ease:"Power1.easeOut"});
        TweenLite.to( $('.sideNav'), 0.20, { right:0, ease:"Power1.easeOut", onStart: function() {}, onComplete:function(){
          IBMMasters.sidebarNav.menuOpen = 'true';
        }});
        TweenLite.delayedCall( 0.4, IBMMasters.sidebarNav.enableCloseButton  );
      },

      slideCloseSidebarNav: function() {
        TweenLite.to( $('.bars'), 0.20, {right: 0, ease:"Power1.easeOut"});
        TweenLite.to( $('.sideNav'), 0.20, {right:'-360px', ease:"Power1.easeOut", onStart: function() {}, onComplete:function(){
          IBMMasters.sidebarNav.menuOpen = 'false';
          IBMMasters.sidebarNav.closeEnabled = 'false';

          //reset sidebar filter menu
          IBMMasters.sidebarNav.resetFilterListTogglesAndSubmenus();
          IBMMasters.sidebarNav.refreshScrollbar();
        }});
      },

      attachEventHandlers: function() {
        //console.log('IBMMasters.sidebarNav.attachEventHandlers');

        that = this;

        // CHEESEBURGER - OPEN/CLOSE NAV
        $('.bars').on(this.onHandler, function(){
          console.log('bars click');
          if ( IBMMasters.sidebarNav.menuOpen  === 'false' ) {
            IBMMasters.sidebarNav.slideOpenSidebarNav();
            // TRACKING -----------------------------------------------------------------------------
            IBMMasters.tracking.trackCustomEvent('global', 'nav', 'click', 'global_nav_click_open');
            //---------------------------------------------------------------------------------------
          } else {
            // safety check for double taps
            if( IBMMasters.sidebarNav.closeEnabled === 'false' ){ console.log('return'); return; }
            IBMMasters.sidebarNav.slideCloseSidebarNav();
            // TRACKING -----------------------------------------------------------------------------
            IBMMasters.tracking.trackCustomEvent('global', 'nav', 'click', 'global_nav_click_close');
            //---------------------------------------------------------------------------------------
          }
        });

        // X CLOSE BUTTON
        $('.closeBtn').on(this.onHandler, function(){  console.log('close');
          // safety check for double taps
          if( IBMMasters.sidebarNav.closeEnabled === 'false' ){ console.log('return'); return; }
          IBMMasters.sidebarNav.slideCloseSidebarNav();
          // TRACKING -----------------------------------------------------------------------------
          IBMMasters.tracking.trackCustomEvent('global', 'nav', 'click', 'global_nav_click_close');
          //---------------------------------------------------------------------------------------
        });


        // SIDEBAR NAV LINKS
        if( this.onHandler === 'click' )
        {
            // console.log('IBMMasters.sidebarNav.onHandler - that: ', that);
            // console.log('IBMMasters.sidebarNav.onHandler - this: ', this);
            // $('.main .nav-link').on( this.onHandler, function(e) { that.doNavLinkClick( this ); });
            $('.main .nav-link').on( this.onHandler, function(e) 
            {
              TweenLite.to( $('.bars'), 0.20, {right: 0, ease:"Power1.easeOut"});
              TweenLite.to($('.sideNav'), 0.20, { right:'-360px', ease:"Power1.easeOut", onComplete:function(){
                IBMMasters.sidebarNav.menuOpen = 'false';

                // TRACKING -----------------------------------------------------------------------------
                var $el       = $(e.currentTarget),
                    evgroup   = 'global',
                    ev        = 'nav',
                    evaction  = 'click',
                    text      = $el.text(),
                    textLower = text.toLowerCase(),
                    linkName  = textLower.split(' ').join('-'),
                    evname    = evgroup + '_' + ev + '_' + evaction + '_' +linkName;

                IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);
                //---------------------------------------------------------------------------------------

                var hash = $el.data('hash');
                window.location = './stories/'+hash;
              }});
            });
        }
        else
        {
          $('.main .nav-link').on( 'touchstart', this.onTouchStart );
          $('.main .nav-link').on( 'touchend', this.onTouchEnd );
          // $('.main .nav-link').on( 'touchmove', this.onTouchMove ); Only useful when testing.
        };

        // A HREF LINKS - HOMEPAGE index.html AND VOICES voices.html
        $('.main a').on(this.onHandler, function(e)
        {
          //e.preventDefault();
          //TweenLite.to( $('.sideNav'), 0.20, {right:'-360px', ease:"Power1.easeOut", onComplete:function(){
            //IBMMasters.sidebarNav.menuOpen = 'false';

            // TRACKING -----------------------------------------------------------------------------
            var $el       = $(e.currentTarget),
              evgroup   = 'global',
              ev        = 'nav',
              evaction  = 'click',
              text      = $el.text(),
              textLower = text.toLowerCase(),
              linkName  = textLower.split(' ').join('-');

            if( linkName === '') linkName = $el.data('linkname');


            var evname  = evgroup +'_' + ev +'_' + evaction +'_' + linkName;

            IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);
            //---------------------------------------------------------------------------------------

            // EXECUTE LINK on Android
            if( that.onHandler === 'touchstart')
            {
              var hyperlink = $el.attr('href');
              console.log('hyperlink', hyperlink);
              if( linkName === 'home' )
              {
                window.location = hyperlink;
              }
              else
              {
                window.open(hyperlink,'_blank');
              }
            }
        });

      },

      setUpFooterNav: function(){
        console.log('IBMMasters.sidebarNav.setUpFooterNav');
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
            window.location = './stories/'+hash;
          }
          //e.preventDefault();

        });
      },


      doNavLinkClick: function( target )
      {
        TweenLite.to( $('.bars'), 0.20, {right: 0, ease:"Power1.easeOut"});
        TweenLite.to($('.sideNav'), 0.20, { right:'-360px', ease:"Power1.easeOut", onComplete:function(){
          IBMMasters.sidebarNav.menuOpen = 'false';

          // TRACKING -----------------------------------------------------------------------------
          var $el       = $(target),
              evgroup   = 'global',
              ev        = 'nav',
              evaction  = 'click',
              text      = $el.text(),
              textLower = text.toLowerCase(),
              linkName  = textLower.split(' ').join('-'),
              evname    = evgroup + '_' + ev + '_' + evaction + '_' +linkName;

          IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);
          //---------------------------------------------------------------------------------------

          var hash = $el.data('hash');
          window.location = './stories/'+hash;
        }});
      },
      
     
      /**************************************
      / EVENT HANDLERS for MOBILE SCROLLING
      /*************************************/
      onTouchStart: function(e) 
      {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        var elm = $(this).offset();
        this.yStart = touch.pageY - elm.top;
      },

      onTouchMove: function(e) 
      {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        var elm = $(this).offset();
        var y = touch.pageY - elm.top;
      },

      onTouchEnd: function(e) 
      {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        var elm = $(this).offset();
        this.yEnd = touch.pageY - elm.top;
        var yDifference = Math.abs( this.yStart - this.yEnd );
        
        if( yDifference <= 5 )  that.doNavLinkClick( this );
      }


    };

    // init called from homepage.js
    // after json loaded and handlebars template rendered
    //IBMMasters.sidebarNav.init();

})(window.jQuery);