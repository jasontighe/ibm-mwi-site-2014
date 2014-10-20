define(['App', 'backbone', 'marionette', 'views/MainView', 'views/MissionView', 'views/DesktopHeaderView', 'views/DesktopFooterView',  'views/SidebarNavView', 'views/StoryIndexView', 'collections/Stories', 'collections/Templates', 'models/Model'],
    function (App, Backbone, Marionette, MainView, MissionView, DesktopHeaderView, DesktopFooterView, SidebarNavView, StoryIndexView,  Stories, Templates, Model) {
    return Backbone.Marionette.Controller.extend({

        initialize:function (options) {

          //App.headerRegion.show(new DesktopHeaderView());
          //App.footerRegion.show(new DesktopFooterView());
          console.log('DesktopController.initialize');
        },

        index:function () {

          // Get query string and parse into object
          var hash = window.location.hash;
          var queryStringArray = hash.split("?");
          console.log('queryStringArray=',queryStringArray);
          var mainModel = new Model();
          if( queryStringArray.length > 1 ){
            console.log('queryStringArray length='+queryStringArray.length);
            var queryStringParamsObj = App.getQueryStringParams(queryStringArray[1]);
            console.log('queryStringParamsObj',queryStringParamsObj);
            if ( queryStringParamsObj.ref === 'home' ) {
              mainModel.set({'ref':'home'});
            }
          }

          var headerModel = App.siteCollection.at(0);// get 'header' data from site.json
          headerModel.set({'showViewAllButton':false});
          App.headerRegion.show(new DesktopHeaderView({model:headerModel}));
          // load all of the stories
          App.mainRegion.show(new MainView({
            collection: App.storiesCollection, model: mainModel
          }));
          App.footerRegion.show(new DesktopFooterView({collection:App.siteCollection}));

          // TRACKING -----------------------------------------------------------------------------
          var evgroup = 'stories',
              ev      = '#',
              evaction= 'pageload',
              evname  = evgroup + '_' + ev + '_' + evaction;

          IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );
          //---------------------------------------------------------------------------------------
        },

        storyIndex:function () {
          App.headerRegion.close();
          var storiesIndexCollection =  App.storiesCollection.clone();
          storiesIndexCollection.sortByCompanyName();
          App.mainRegion.show(new StoryIndexView({ collection: storiesIndexCollection }));
          App.footerRegion.show(new DesktopFooterView({collection:App.siteCollection}));

          // TRACKING -----------------------------------------------------------------------------
          var evgroup = 'stories',
            ev      =  window.location.hash,
            evaction= 'pageload',
            evname  = evgroup + '_' + ev + '_' + evaction;

          IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );
          //---------------------------------------------------------------------------------------
        },

        story:function (query) {
          console.log('query='+query);

          // Get query strings after ? and parse into object
          var queryStringArray = query.split("?");
          var mainModel = new Model();
          if( queryStringArray.length > 1 ){
            console.log('queryStringArray length='+queryStringArray.length);
            var queryStringParamsObj = App.getQueryStringParams(queryStringArray[1]);
            console.log('queryStringParamsObj',queryStringParamsObj);
            console.log('queryStringParamsObj.ref='+queryStringParamsObj.ref);
            if ( queryStringParamsObj.ref === 'home' ) {
              mainModel.set({'ref':'home'});
            }
          }

          // Clone the global collection created from JSON file
          var stories = App.storiesCollection.clone();

          // Create collection used to slice data
          var trimmedStoriesCollection;

          // check for query strings
          if( typeof query != 'undefined' ) {

            console.log('querystring: id = '+query);
            var storyIdNum = parseInt(query, 10);
            var storyById = stories.where({ id: storyIdNum });
            // if id exists trim collection to that id
            if(storyById.length > 0) {
              console.log('storyById', storyById);
              //console.log('getById: ', stories.get(storyIdNum) );
              var storyModel = stories.get(storyIdNum);
              var storyCollectionIndex = stories.indexOf(storyModel);
              trimmedStoriesCollection = new Stories(stories.slice(storyCollectionIndex, stories.length));

              var headerModel = App.siteCollection.at(0);// get 'header' data from site.json
              if (trimmedStoriesCollection.length < stories.length ) {
                headerModel.set({'showViewAllButton':true});
              } else {
                headerModel.set({'showViewAllButton':false});
              }
              App.headerRegion.show(new DesktopHeaderView({model: headerModel}));

              // Load trimmed collection and model
              App.mainRegion.show(new MainView({
                collection: trimmedStoriesCollection, model: mainModel
              }));
              App.footerRegion.show(new DesktopFooterView({collection:App.siteCollection}));

              // TRACKING -----------------------------------------------------------------------------
              var evgroup = 'stories',
                ev      =  window.location.hash,
                evaction= 'pageload',
                evname  = evgroup + '_' + ev + '_' + evaction;

              IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );
              //---------------------------------------------------------------------------------------

            } else {

              // redirect to app index
              this.redirect();

            }
          }
        },

        filterByTech:function (query) {
          console.log('filterByTech:', query);

          // Get query string and parse into object
          var hash = window.location.hash;
          var queryStringArray = hash.split("?");
          console.log('queryStringArray=',queryStringArray);
          var mainModel = new Model();
          if( queryStringArray.length > 1 ){
            console.log('queryStringArray length='+queryStringArray.length);
            var queryStringParamsObj = App.getQueryStringParams(queryStringArray[1]);
            console.log('queryStringParamsObj',queryStringParamsObj);
            if ( queryStringParamsObj.ref === 'home' ) {
              mainModel.set({'ref':'home'});
            }
          }

          var headerModel = App.siteCollection.at(0);// get 'header' data from site.json
          headerModel.set({'showViewAllButton':true});
          App.headerRegion.show(new DesktopHeaderView({model: headerModel}));
          // check if tech is defined
          if( typeof query != 'undefined' ) {
            // create filtered category collection
            var filteredCollection;
            if (queryStringArray.length > 1){
              // strip out ?ref=home
              var stringArray =  query.split("?");
              filteredCollection = App.storiesCollection.filterByTech(stringArray[0]);
            } else {
              filteredCollection = App.storiesCollection.filterByTech(query);
            }

            console.log('Tech collection', filteredCollection);
            if ( filteredCollection.length > 0 ){
              // Load the filtered collection
              App.mainRegion.show(new MainView({
                collection: filteredCollection, model:mainModel
              }));
              App.footerRegion.show(new DesktopFooterView({collection:App.siteCollection}));

              // TRACKING -----------------------------------------------------------------------------
              var evgroup = 'stories',
                ev      =  window.location.hash,
                evaction= 'pageload',
                evname  = evgroup + '_' + ev + '_' + evaction;

              IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );
              //---------------------------------------------------------------------------------------
            }  else {
              //console.log('filterByTech: no-match');
              this.redirect();
            }
          } else {
            // redirect to app index
            this.redirect();
          }
        },

        filterByTechId:function (query, id) {
          console.log('filterByTech: '+ query +' and Id: '+ id);

          // Get query string and parse into object
          var hash = window.location.hash;
          var queryStringArray = hash.split("?");
          console.log('queryStringArray=',queryStringArray);
          var mainModel = new Model();
          if( queryStringArray.length > 1 ){
            console.log('queryStringArray length='+queryStringArray.length);
            var queryStringParamsObj = App.getQueryStringParams(queryStringArray[1]);
            console.log('queryStringParamsObj',queryStringParamsObj);
            if ( queryStringParamsObj.ref === 'home' ) {
              mainModel.set({'ref':'home'});
            }
          }

          var headerModel = App.siteCollection.at(0);// get 'header' data from site.json
          headerModel.set({'showViewAllButton':true});
          App.headerRegion.show(new DesktopHeaderView({model: headerModel}));
          // check if tech is defined
          if( typeof query != 'undefined' ) {
            // create filtered category collection
            var filteredCollection = App.storiesCollection.filterByTech(query);
            //console.log('tech collection', filteredCollection);
            if ( filteredCollection.length > 0 && typeof id != 'undefined' ) {
              var storyIdNum = parseInt(id, 10);
              // check that story exists by id
              var storyById = filteredCollection.where({ id: storyIdNum });
              // trim collection
              var storyModel = filteredCollection.get(storyIdNum);
              var storyCollectionIndex = filteredCollection.indexOf(storyModel);
              var trimmedCollection = new Stories(filteredCollection.slice(storyCollectionIndex));

              if ( storyById.length > 0 && trimmedCollection.length > 0 ){
                console.log('Tech collection LTE id: '+storyIdNum, trimmedCollection);
                // Load the filtered and trimmed collection
                App.mainRegion.show(new MainView({
                  collection: trimmedCollection, model: mainModel
                }));
                App.footerRegion.show(new DesktopFooterView({collection:App.siteCollection}));

                // TRACKING -----------------------------------------------------------------------------
                var evgroup = 'stories',
                  ev      =  window.location.hash,
                  evaction= 'pageload',
                  evname  = evgroup + '_' + ev + '_' + evaction;

                IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );
                //---------------------------------------------------------------------------------------
              }  else {
                //console.log('filterById: no-match');
                this.redirect();
              }
            }  else {
              //console.log('filterByTech: no-match');
              this.redirect();
            }
          } else {
             //redirect to app index
            this.redirect();
          }
        },

        filterByIndustry:function (query) {
          console.log('filterByIndustry:', query);
          var headerModel = App.siteCollection.at(0);// get 'header' data from site.json
          headerModel.set({'showViewAllButton':true});
          App.headerRegion.show(new DesktopHeaderView({model: headerModel}));
          // check if industry is defined
          if( typeof query != 'undefined' ) {
            // create filtered category collection
            var filteredCollection = App.storiesCollection.filterByIndustry(query);
            console.log('Industry collection', filteredCollection);
            if ( filteredCollection.length > 0 ){
              // Load the filtered collection
              App.mainRegion.show(new MainView({
                collection: filteredCollection
              }));
              App.footerRegion.show(new DesktopFooterView({collection:App.siteCollection}));

              // TRACKING -----------------------------------------------------------------------------
              var evgroup = 'stories',
                ev      =  window.location.hash,
                evaction= 'pageload',
                evname  = evgroup + '_' + ev + '_' + evaction;

              IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );
              //---------------------------------------------------------------------------------------
            }  else {
              //console.log('filterByIndustry: no-match');
              this.redirect();
            }
          } else {
            // redirect to app index
            this.redirect();
          }
        },

        filterByIndustryId:function (query, id) {
          console.log('filterByIndustry: '+ query +' and Id: '+ id);

          // Get query string and parse into object
          var hash = window.location.hash;
          var queryStringArray = hash.split("?");
          console.log('queryStringArray=',queryStringArray);
          var mainModel = new Model();
          if( queryStringArray.length > 1 ){
            console.log('queryStringArray length='+queryStringArray.length);
            var queryStringParamsObj = App.getQueryStringParams(queryStringArray[1]);
            console.log('queryStringParamsObj',queryStringParamsObj);
            if ( queryStringParamsObj.ref === 'home' ) {
              mainModel.set({'ref':'home'});
            }
          }

          var headerModel = App.siteCollection.at(0);// get 'header' data from site.json
          headerModel.set({'showViewAllButton':true});
          App.headerRegion.show(new DesktopHeaderView({model: headerModel}));
          // check if industry is defined
          if( typeof query != 'undefined' ) {
            // create filtered category collection
            var filteredCollection = App.storiesCollection.filterByIndustry(query);
            //console.log('industry collection', filteredCollection);
            if ( filteredCollection.length > 0 && typeof id != 'undefined' ) {
              var storyIdNum = parseInt(id, 10);
              // check that story exists by id
              var storyById = filteredCollection.where({ id: storyIdNum });
              // trim collection
              var storyModel = filteredCollection.get(storyIdNum);
              var storyCollectionIndex = filteredCollection.indexOf(storyModel);
              var trimmedCollection = new Stories(filteredCollection.slice(storyCollectionIndex));

              if ( storyById.length > 0 && trimmedCollection.length > 0 ){
                console.log('Industry collection LTE id: '+storyIdNum, trimmedCollection);
                // Load the filtered and trimmed collection
                App.mainRegion.show(new MainView({
                  collection: trimmedCollection, model: mainModel
                }));
                App.footerRegion.show(new DesktopFooterView({collection:App.siteCollection}));

                // TRACKING -----------------------------------------------------------------------------
                var evgroup = 'stories',
                  ev      =  window.location.hash,
                  evaction= 'pageload',
                  evname  = evgroup + '_' + ev + '_' + evaction;

                IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );
                //---------------------------------------------------------------------------------------
              }  else {
                //console.log('filterById: no-match');
                this.redirect();
              }
            }  else {
              //console.log('filterByIndustry: no-match');
              this.redirect();
            }
          } else {
            //redirect to app index
            this.redirect();
          }
        },

        filterByCapability:function (query) {
          console.log('filterByCapability:', query);
          var headerModel = App.siteCollection.at(0);// get 'header' data from site.json
          headerModel.set({'showViewAllButton':true});
          App.headerRegion.show(new DesktopHeaderView({model: headerModel}));
          // check if capability is defined
          if( typeof query != 'undefined' ) {
            // create filtered capability collection
            var filteredCollection = App.storiesCollection.filterByCapability(query);
            console.log('Capability collection', filteredCollection);
            if ( filteredCollection.length > 0 ){
              // Load the filtered collection
              App.mainRegion.show(new MainView({
                collection: filteredCollection
              }));
              App.footerRegion.show(new DesktopFooterView({collection:App.siteCollection}));

              // TRACKING -----------------------------------------------------------------------------
              var evgroup = 'stories',
                ev      =  window.location.hash,
                evaction= 'pageload',
                evname  = evgroup + '_' + ev + '_' + evaction;

              IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );
              //---------------------------------------------------------------------------------------
            }  else {
              //console.log('filterByCapability: no-match');
              this.redirect();
            }
          } else {
            // redirect to app index
            this.redirect();
          }
        },

        filterByCapabilityId:function (query, id) {
          console.log('filterByCapability: '+ query +' and Id: '+ id);

          // Get query string and parse into object
          var hash = window.location.hash;
          var queryStringArray = hash.split("?");
          console.log('queryStringArray=',queryStringArray);
          var mainModel = new Model();
          if( queryStringArray.length > 1 ){
            console.log('queryStringArray length='+queryStringArray.length);
            var queryStringParamsObj = App.getQueryStringParams(queryStringArray[1]);
            console.log('queryStringParamsObj',queryStringParamsObj);
            if ( queryStringParamsObj.ref === 'home' ) {
              mainModel.set({'ref':'home'});
            }
          }

          var headerModel = App.siteCollection.at(0);// get 'header' data from site.json
          headerModel.set({'showViewAllButton':true});
          App.headerRegion.show(new DesktopHeaderView({model: headerModel}));
          // check if Capability is defined
          if( typeof query != 'undefined' ) {
            // create filtered category collection
            var filteredCollection = App.storiesCollection.filterByCapability(query);
            //console.log('Capability collection', filteredCollection);
            if ( filteredCollection.length > 0 && typeof id != 'undefined' ) {
              var storyIdNum = parseInt(id, 10);
              // check that story exists by id
              var storyById = filteredCollection.where({ id: storyIdNum });
              // trim collection
              var storyModel = filteredCollection.get(storyIdNum);
              var storyCollectionIndex = filteredCollection.indexOf(storyModel);
              var trimmedCollection = new Stories(filteredCollection.slice(storyCollectionIndex));

              if ( storyById.length > 0 && trimmedCollection.length > 0 ){
                console.log('Capability collection LTE id: '+storyIdNum, trimmedCollection);
                // Load the filtered and trimmed collection
                App.mainRegion.show(new MainView({
                  collection: trimmedCollection, model: mainModel
                }));
                App.footerRegion.show(new DesktopFooterView({collection:App.siteCollection}));

                // TRACKING -----------------------------------------------------------------------------
                var evgroup = 'stories',
                  ev      =  window.location.hash,
                  evaction= 'pageload',
                  evname  = evgroup + '_' + ev + '_' + evaction;

                IBMMasters.tracking.trackCustomEvent( evgroup, ev, evaction, evname );
                //---------------------------------------------------------------------------------------
              }  else {
                //console.log('filterById: no-match');
                this.redirect();
              }
            }  else {
              //console.log('filterByCapability: no-match');
              this.redirect();
            }
          } else {
            //redirect to app index
            this.redirect();
          }
        },

        redirect:function() {
          // redirect to app index
          console.log('redirect');
          window.location.hash = '#'; //Backbone.history.navigate('', true);
        }
    });
});