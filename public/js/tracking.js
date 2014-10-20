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

    IBMMasters.namespace('IBMMasters.tracking');
    IBMMasters.tracking = {

      init: function() {
        console.log('IBMMasters.tracking.init');

        IBMMasters.tracking.trackHTMLPagesAsPseudoPageloads();

      },

      trackCustomEvent : function(evgroup, ev, evaction, evname) {

        //if(IBM.SE.tracking.last_evname === evname) return;
        //IBM.SE.tracking.last_evname = evname;

        try {
          console.log('IBMMasters.tracking.trackCustomEvent evgroup: '+evgroup+', ev: '+ev+', evaction: '+evaction+', evname: '+evname);
          ibmStats.event({ 'ibmEvGroup' : evgroup, 'ibmEV' : ev, 'ibmEvAction' : evaction, 'ibmEvName' : evname });
        } catch(error) {
          console.log('IBMMasters.tracking.trackCustomEvent.error: '+error);
        }
      },

      addScrollWaypoints : function () {
        console.log('IBMMasters.tracking.addScrollWaypoints');

        // Cleanup old waypoints
        $.waypoints('destroy');

        // Story level scroll tracking
        $('.story-waypoint').waypoint({
          triggerOnce: true,
          handler: function(direction) {
            //console.log('waypoint :', direction, this);
            if (direction==='down'){

              var storyId   = 's' + $(this).attr('id').replace('story-', ''),
                  hash      = (window.location.hash != '') ? window.location.hash : '#',
                  evgroup   = 'stories',
                  ev        = hash,
                  evaction  = 'scroll',
                  evname    = evgroup + '_' + ev +  '_' + evaction + '_' +storyId;

              IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);
            }
          }
        });

        // Template level scroll tracking
        $('.template-waypoint').waypoint({
          triggerOnce: true,
          handler: function(direction) {
            //console.log('template-waypoint :', direction, this);

            if (direction==='down'){

              var storyId   = 's' + $(this).closest('.story-waypoint').attr('id').replace('story-', ''),
                  templateId= $(this).data('template');
                  hash      = (window.location.hash != '') ? window.location.hash : '#',
                  evgroup   = 'stories',
                  ev        = hash,
                  evaction  = 'scroll',
                  evname    = evgroup + '_' + ev +  '_' + evaction + '_' +storyId + templateId;

              IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);

            }
          }
        });

        // Story-Index scroll tracking
        var rowCounter = 1;
        $('.index-waypoint').waypoint({
          triggerOnce: true,
          handler: function(direction) {
            //console.log('waypoint :', direction, this);
            if (direction==='down'){

              var //storyId   = 's' + $(this).data('id');
                hash      = (window.location.hash != '') ? window.location.hash : '#',
                evgroup   = 'stories',
                ev        = hash,
                evaction  = 'scroll',
                evname    = evgroup + '_' + ev +  '_' + evaction + '_' +rowCounter;

              IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);
              rowCounter += 1;
            }
          }
        });


      },

      updateScrollWaypoints : function (storyIdSelector) {
        console.log('updateScrollWaypoints for '+storyIdSelector);

        // Story level scroll tracking
        $(storyIdSelector).waypoint({
          triggerOnce: true,
          handler: function(direction) {
            //console.log('waypoint :', direction, this);
            if (direction==='down'){

              var storyId   = 's' + $(this).attr('id').replace('story-', ''),
                hash      = (window.location.hash != '') ? window.location.hash : '#',
                evgroup   = 'stories',
                ev        = hash,
                evaction  = 'scroll',
                evname    = evgroup + '_' + ev +  '_' + evaction + '_' +storyId;

              IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);
            }
          }
        });

        // Template level scroll tracking
        var templateSelector = storyIdSelector + ' ' + '.template-waypoint';
        $(templateSelector).waypoint({
          triggerOnce: true,
          handler: function(direction) {
            //console.log('template-waypoint :', direction, this);

            if (direction==='down'){

              var storyId   = 's' + $(this).closest('.story-waypoint').attr('id').replace('story-', ''),
                templateId= $(this).data('template');
                hash      = (window.location.hash != '') ? window.location.hash : '#',
                evgroup   = 'stories',
                ev        = hash,
                evaction  = 'scroll',
                evname    = evgroup + '_' + ev +  '_' + evaction + '_' +storyId + templateId;

              IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);

            }
          }
        });

        // refresh to add new waypoints
        $.waypoints('refresh');
      },

      trackSocialShare : function (socialSerivce, storyIdNumber) {
        console.log('IBMMasters.tracking.trackSocialShare');

        var ev = (window.location.hash != '') ? window.location.hash : '#';
        var evname = 'stories'+'_'+ev+'_'+'share'+'_'+'s'+storyIdNumber+'_'+socialSerivce;

        IBMMasters.tracking.trackCustomEvent( 'stories', ev, 'share', evname );

      },


      trackHTMLPagesAsPseudoPageloads: function() {
        var pathname = window.location.pathname;

        switch (pathname) {
          case '/smarterplanet/us/en/madewithibm/' : {
            // main homepage
            console.log('stories_index.html_pageload');
            IBMMasters.tracking.trackCustomEvent( 'stories', 'index.html', 'pageload', 'stories_index.html_pageload' );
          }

          break;
          case '/smarterplanet/us/en/madewithibm/index.html' : {
            // main homepage
            console.log('stories_index.html_pageload');
            IBMMasters.tracking.trackCustomEvent( 'stories', 'index.html', 'pageload', 'stories_index.html_pageload' );

          }

          break;
          case '/smarterplanet/us/en/madewithibm/voices.html' : {
            // voices page
            console.log('stories_voices.html_pageload');
            IBMMasters.tracking.trackCustomEvent( 'stories', 'voices.html', 'pageload', 'stories_voices.html_pageload' );
          }

          default :
            // do nothing
            //console.log('pageload!');
        }
      }

    };

    // set it off
    IBMMasters.tracking.init();

})(window.jQuery);