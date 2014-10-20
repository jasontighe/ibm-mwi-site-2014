define( ['App', 'backbone', 'marionette', 'jquery', 'hbs!templates/storyIndex', 'views/StoryIndexItemView'],
  function(App, Backbone, Marionette, $, template, ItemView) {
    //ItemView provides some default rendering logic
    return Backbone.Marionette.CompositeView.extend( {
      template: template,
      itemView: ItemView,
      itemViewContainer: "ul",
      /*model: new Student({
       mobile: App.mobile
       }),*/
      initialize: function() {
        //this.collection = this.model.get('stories');
      },
      onRender: function() {
        //this.$el.navbar();
      },

      onShow: function() {
        //console.log('StoryIndexView.onShow: ');
        // track scroll
        IBMMasters.tracking.addScrollWaypoints();
        // track clicks
        $('.story-title').on('click', function(e) {
          var storyId     = 's' + $(e.currentTarget).data('id'),
              evgroup     = 'stories',
              ev          = '#!story-index',
              evaction    = 'click',
              evname      = evgroup + '_' + ev +  '_' + evaction + '_' +storyId;

          IBMMasters.tracking.trackCustomEvent(evgroup, ev, evaction, evname);

        });

        // reset scroll to top
        window.scrollTo(0,0);
      },

      // View Event Handlers
      events: {

      }
    });
  });