define( ['App', 'backbone', 'marionette', 'jquery', 'models/Story', 'hbs!templates/storyIndexItem'],
  function(App, Backbone, Marionette, $, Model, template) {
    //ItemView provides some default rendering logic
    return Backbone.Marionette.ItemView.extend( {
      template: template,
      tagName: "li",
      /*model: new Student({
       mobile: App.mobile
       }),*/

      // View Event Handlers
      events: {
		"hover":function(){
			var $img = this.$el.find('img');
			var newBackground = $img.data('background-swap');
			var oldBackground = $img.css('background-color');
			$img.attr('style','background-color:'+newBackground);
			$img.data('background-swap', oldBackground);
		}
      },
      initialize: function(){
        this.model.set('capability', this.model.get('templates')[0].modules[0].assets[0].capability);
      }
    });
  });