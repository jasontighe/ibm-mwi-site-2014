define( ['App', 'backbone', 'marionette', 'jquery', 'hbs!templates/main', 'views/StoryView', 'models/Model', 'jqueryScrollTo'],
  function(App, Backbone, Marionette, $, template, ItemView, Model, scrollTo) {
    //ItemView provides some default rendering logic
    return Backbone.Marionette.CompositeView.extend( {
      template: template,
      itemView: ItemView,
      itemViewContainer: "#stories",
      /*
      model: new Model({
        'lazyLoadMaxItems'      : 8,  // DESKTOP LAZY LOAD LIMIT
        'visibleMaxItems'       : 16, // DESKTOP VISIBLE ITEM LIMIT
        'currentTopItemIndex'   : 0,
        'currentLastItemIndex'  : 0   // Value reset below on init
      }),
      */
      // child view item pre-init logic
      itemViewOptions: function(model, index) {

        // Set collection index on each story view
        var itemCollectionIndex = this.collection.indexOf(model);

        return {
          lazyLoadItemIndex: itemCollectionIndex,
          lazyLoadMaxItems: this.model.get('lazyLoadMaxItems')
        };
      },

      initialize: function() {
        console.log('MainView.initialize');
        console.log('MainView collection:', this.collection);

        // Create a model for those routes that don't check query strings in DesktopController.js
        if (typeof this.model === 'undefined') {
          this.model = new Model();
          console.log('MainView new Model');
        }

        this.model.set({'currentTopItemIndex': 0});
        this.model.set({'currentLastItemIndex': 0}); // Value reset below

        // Get platform info
        this.iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
        this.touch = !( $('html').hasClass('no-touch') );

        // Set on handler for mobile or desktop
        this.onHandler = ( this.touch /*&& !this.iOS*/ ) ? 'touchstart' : 'click';
        console.log('MainView onHandler='+this.onHandler);

        // If mobile then set lower lazy load max
        if ( this.iOS ||  this.touch ) {
          this.model.set({'lazyLoadMaxItems': 3});  // MOBILE LAZY LOAD LIMIT
          this.model.set({'visibleMaxItems': 6});   // MOBILE VISIBLE ITEM LIMIT
        } else {
          this.model.set({'lazyLoadMaxItems': 8});  // DESKTOP LAZY LOAD LIMIT
          this.model.set({'visibleMaxItems': 16});   // DESKTOP VISIBLE ITEM LIMIT
        }

        // Get lazy load max items
        var lazyLoadMaxItems =  this.model.get('lazyLoadMaxItems');
        console.log('MainView lazyLoadMaxItems:'+lazyLoadMaxItems );

        // Set current last item index  - for lazy load
        var currentLastItemIndex;
        if ( this.collection.length > lazyLoadMaxItems ) {
          currentLastItemIndex = lazyLoadMaxItems - 1;
          this.model.set({'currentLastItemIndex': currentLastItemIndex} );
        }
        else {
          currentLastItemIndex = (this.collection.length - 1);
          this.model.set({'currentLastItemIndex': currentLastItemIndex} );
        }
        //console.log('MainView currentLastItemIndex:'+this.model.get('currentLastItemIndex') );

        // Set 'Show More' button text based on site.json
        var showMore =  App.siteCollection.at(0).get('show_more');
        this.model.set({'show_more': showMore} );

      },

      onRender: function() {
        //console.log('MainView.onRender');
      },

      onShow: function() {
        //console.log('MainView.onShow: ');

        this.addButtonHandlers();

        this.initShowMoreButton();


        if ( (typeof this.model.get('ref') != 'undefined') && (this.model.get('ref') === 'home') ) {

          // reset scroll to top item
          console.log('MainView scroll to top item');

          var topItemModel = this.collection.at(0);
          var topItemId =  topItemModel.id;
          var $topItem = '#story-'+ topItemId;

          console.log('$topItem = '+topItemId);

          $.scrollTo($topItem, {offset:-40});

        } else {

          // reset scroll to top
          console.log('MainView scroll to header');
          window.scrollTo(0,0);
        }



        // add scroll tracking for initial loaded items
        // lazy loaded items scroll tracking added in StoryView.js
        IBMMasters.tracking.addScrollWaypoints();
      },

      addButtonHandlers: function() {
        var that = this;
        // lazy load button - bottom items
        $('.show-more').on( this.onHandler,  function(){ that.lazyLoadMore(); });
        // show hidden button - top items
        $('.show-hidden').on( this.onHandler,  function(){ that.displayHiddenTopItems(); });
      },

      initShowMoreButton: function() {
        //console.log('MainView.initShowMore()');
        // display 'show more'
        if( this.collection.length > this.model.get('lazyLoadMaxItems') ) {
          $('.show-more').show();
        }
      },


      displayShowMoreButton: function() {
        //console.log('hideShowMoreButton');
        $('.show-more').show();
      },

      hideShowMoreButton: function() {
        //console.log('hideShowMoreButton');
        $('.show-more').hide();
      },

      displayShowHiddenButton: function() {
        //console.log('displayShowHiddenButton');
        $('.show-hidden').show();
      },

      hideShowHiddenButton: function() {
        //console.log('hideShowHiddenButton');
        $('.show-hidden').hide();
      },

      lazyLoadMore: function() {
        //console.log('lazy load more');

        var currentLastItemIndex = this.model.get('currentLastItemIndex');
        var newLastItemIndex = currentLastItemIndex + this.model.get('lazyLoadMaxItems');
        var counter = 0;
        var itemView;

        // If current items displayed plus new lazy loaded items
        // exceeds visible max items then hide top items
        var visibleMaxItems   = this.model.get('visibleMaxItems');
        var topMostItemIndex  = this.model.get('currentTopItemIndex');
        var itemsDisplayed    = (newLastItemIndex - topMostItemIndex)+1;

        if( itemsDisplayed > visibleMaxItems ) {
          console.log("MAX ITEMS OF " + visibleMaxItems + " EXCEEDED!");
          console.log("ITEMS DISPLAYED: " + itemsDisplayed);

          // HIDE TOP ITEMS
          this.hideTopItems();
        }

        // Lazy load new items at bottom
        for (var i = currentLastItemIndex+1; i <= newLastItemIndex; i++) {

          if( i <  this.collection.length ){
            itemView = this.children.findByIndex(i);
            console.log('itemIndex = '+ i + ' ', itemView);
            itemView.deferredRender();
            counter +=1;
          } else {
            console.log('no more items');
          }
        }
        this.model.set({'currentLastItemIndex':newLastItemIndex});

        // If no more items in queue hide show more buttons
        if( newLastItemIndex >= this.collection.length-1 ) {
          this.hideShowMoreButton();
        }

        // Scroll to top of first new item loaded
        var newFirstItemLazyLoadedIndex = (newLastItemIndex -  this.model.get('lazyLoadMaxItems')) +1;
        var newFirstItemLazyLoaded = this.children.findByIndex(newFirstItemLazyLoadedIndex);
        var newFirstItemLazyLoadedId =  newFirstItemLazyLoaded.model.id;
        var $newFirstItemLazyLoaded = '#story-'+ newFirstItemLazyLoadedId;

        //console.log('$newFirstItemLazyLoaded = '+$newFirstItemLazyLoaded);

        $.scrollTo($newFirstItemLazyLoaded, {offset:-40});

      },

      hideTopItems: function() {
        console.log('MainView.hideTopItems');
        var topMostItemIndex  = this.model.get('currentTopItemIndex');
        var newTopMostItemIndex = topMostItemIndex + this.model.get('lazyLoadMaxItems');
        var itemView;
        for (var i = topMostItemIndex; i < newTopMostItemIndex; i++) {

          if( i <  this.collection.length ){
            itemView = this.children.findByIndex(i);
            console.log('itemIndex = '+ i + ' ', itemView);
            itemView.hideItemView();
          } else {
            console.log('no more top items to hide');
          }
        }

        // Update model with current top most item index
        this.model.set({'currentTopItemIndex':newTopMostItemIndex});
        console.log('MainView currentTopItemIndex:'+this.model.get('currentTopItemIndex') );

        // Display 'show hidden' button to reload hidden items at top of page
        this.displayShowHiddenButton();
      },

      displayHiddenTopItems: function() {
        console.log('MainView.displayHiddenTopItems');
        var topMostItemIndex  = this.model.get('currentTopItemIndex');
        var newTopMostItemIndex = topMostItemIndex - this.model.get('lazyLoadMaxItems');
        var counter = 0;
        var itemView;
        for (var i = topMostItemIndex+1; i >= newTopMostItemIndex; i--) {

          if( i >=  0 ){
            itemView = this.children.findByIndex(i);
            console.log('itemIndex = '+ i + ' ', itemView);
            itemView.showItemView();
            counter +=1;
          } else {
            console.log('no more items to display');
          }
        }

        // ensure valid index
        newTopMostItemIndex = ( newTopMostItemIndex >= 0 ) ? newTopMostItemIndex : 0;
        // Update model with current top most item index
        this.model.set({'currentTopItemIndex':newTopMostItemIndex});
        console.log('MainView currentTopItemIndex:'+this.model.get('currentTopItemIndex') );

        // If first item in collection shown then hide the show hidden button
        if( newTopMostItemIndex === 0 ) this.hideShowHiddenButton();

        // Hide same number of bottom items so as to not exceed max visible items
        this.hideBottomItems();


        // Scroll to header of last of newly displayed top items
        var newScrollToIndex = newTopMostItemIndex + this.model.get('lazyLoadMaxItems');
        var newScrollToItem = this.children.findByIndex(newScrollToIndex);
        var newScrollToItemId =  newScrollToItem.model.id;
        var $newScrollToItem = '#story-'+ newScrollToItemId;
        //console.log('newScrollToItem  = '+$newScrollToItem);
        $.scrollTo($newScrollToItem, {offset:-40});

      },

      hideBottomItems: function() {
        var currentLastItemIndex = this.model.get('currentLastItemIndex');
        var newLastItemIndex = currentLastItemIndex - this.model.get('lazyLoadMaxItems');
        //var counter = 0;
        var itemView;
        for (var i = currentLastItemIndex; i > newLastItemIndex; i--) {

          if( i <  this.collection.length ){
            itemView = this.children.findByIndex(i);
            console.log('itemIndex = '+ i + ' ', itemView);
            itemView.hideItemView();
            //counter +=1;
          } else {
            console.log('no more bottom items to hide');
          }
        }
        this.model.set({'currentLastItemIndex':newLastItemIndex});
        console.log('MainView currentLastItemIndex:'+this.model.get('currentLastItemIndex') );

        this.displayShowMoreButton();
      },

      // View Event Handlers
      events: {

      }

    });
  });