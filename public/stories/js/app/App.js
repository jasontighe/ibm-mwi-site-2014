define(['jquery', 'backbone', 'marionette', 'underscore', 'handlebars', 'collections/Stories', 'collections/Collection', 'views/SidebarNavView'],
    function ($, Backbone, Marionette, _, Handlebars, Stories, Collection, SidebarNavView) {
        var App = new Backbone.Marionette.Application();

        function isMobile() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return ((/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(userAgent));
        }

        //Organize Application into regions corresponding to DOM elements - by id or data-role
        //Regions can contain views, Layouts, or subregions nested as necessary
        App.addRegions({
            headerRegion:"#site-header",
            sidebarRegion:".sidebar-nav",
            mainRegion:"#main",
            footerRegion:"#site-footer"
        });

        // Load site json - used for sidebar nav menu, header and footer
        App.addInitializer(function () {
          App.siteCollection = new Collection();
          App.siteCollection.fetch({ url: "./js/app/json/site.json" }).complete(function() {
            console.log('Site JSON load complete: ', App.siteCollection);

            // CREATE GLOBAL VARS FOR LOCALIZATION Start.
            var json = App.siteCollection.toJSON();
            var i = 0;
            var I = json.length;
            for(i; i < I; i++ )
            {
                var id = json[ i ].id;
                //console.log('Site JSON load complete - id: ', id);
                if( id === "globalVars")
                {
                    App.learn_more_label = json[ i ].learn_more_label;
                } 
            }
            // CREATE GLOBAL VARS FOR LOCALIZATION End.

            // Init sidebar nav using Site JSON
            App.sidebarRegion.show(new SidebarNavView({collection:App.siteCollection}));
            
            // Load Stories JSON
            App.loadStoriesJson();
          });
        });

        // Load stories json into global stories collection
        App.loadStoriesJson = function() {
          App.storiesCollection = new Stories();
          App.storiesCollection.fetch({ url: "./js/app/json/stories.json" }).complete(function() {
            console.log('Stories JSON load complete: ', App.storiesCollection);
            // Do not start router until JSON load complete
            Backbone.history.start();
          });
        };

        App.mobile = false;//isMobile();

        // Deeplink helper function
        App.getQueryStringParams = function(queryString) {
            var params = {};
            if(queryString){
                _.each(
                    _.map(decodeURI(queryString).split(/&/g),function(el,i){
                        var aux = el.split('='), o = {};
                        if(aux.length >= 1){
                            var val;
                            if(aux.length == 2)
                                val = aux[1];
                            o[aux[0]] = val;
                        }
                        return o;
                    }),
                    function(o){
                        _.extend(params,o);
                    }
                );
            }
            return params;
        };

        App.isIOs = function() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return ((/iPhone|iPod|iPad/).test(userAgent));
        };
      

        return App;
    });