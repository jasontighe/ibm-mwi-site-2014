define( ['App', 'backbone', 'marionette', 'jquery', 'models/Module', 'hbs!templates/module'],
  function(App, Backbone, Marionette, $, Model, template) {
    //ItemView provides some default rendering logic
    return Backbone.Marionette.ItemView.extend( {
      template: template,
      tagName: "div",
      /*model: new Student({
       mobile: App.mobile
       }),*/


    initialize: function(model) {

        console.log( "ModuleView.initialize: model ", model);
        // console.log( "ModuleView.initialize: template ", template);
    },

      // View Event Handlers
      events: {

      },

      handlerbarsCarousel: function() {

      }

    });
  });