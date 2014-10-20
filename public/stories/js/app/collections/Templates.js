define(["jquery","backbone","models/Template"],
  function($, Backbone, Model) {
    // Creates a new Backbone Collection class object
    var Templates = Backbone.Collection.extend({
      // Tells the Backbone Collection that all of it's models will be of type Student (listed up top as a dependency)
      model: Model
    });

    return Templates;
  });