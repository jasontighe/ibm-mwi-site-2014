define(['backbone', 'marionette'], function(Backbone, Marionette) {
   return Backbone.Marionette.AppRouter.extend({

       appRoutes: {
        "": "index",
        "!story/:query" : "story",
        "!story-index"  : "storyIndex",
        "!filter/technology/:query"     : "filterByTech",
        "!filter/technology/:query/:id" : "filterByTechId",
        "!filter/industry/:query"       : "filterByIndustry",
        "!filter/industry/:query/:id"   : "filterByIndustryId",
        "!filter/capability/:query"     : "filterByCapability",
        "!filter/capability/:query/:id" : "filterByCapabilityId",
        "*actions": "index" // catch-all default route redirect to index
       }
   });
});