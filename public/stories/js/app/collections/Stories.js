define(["jquery","backbone","models/Story"],
  function($, Backbone, Model) {
    // Creates a new Backbone Collection class object
    var Stories = Backbone.Collection.extend({
      // Tells the Backbone Collection that all of it's models will be of type Story (listed up top as a dependency)
      model: Model,

      initialize: function() {
        //console.log('Collection Stories.initialize');
      },

      filterByTech: function(value) {

        console.log('Stories.filterByTech: '+value);
        var filteredArrayOfModels = this.where({filterTechnology: value});

        return new Stories(filteredArrayOfModels);
      },

      filterByIndustry: function(value) {
        console.log('Stories.filterByIndustry: '+value);
        var filteredArrayOfModels = this.where({filterIndustry: value});

        return new Stories(filteredArrayOfModels);
      },

      filterByCapability: function(value) {
        console.log('Stories.filterByCapability: '+value);
        var filteredArrayOfModels = this.where({filterCapability: value});

        return new Stories(filteredArrayOfModels);
      },
      /*
      returnItemsWithIdLessThanOrEqualTo: function(value) {
        console.log('Stories.returnItemsWithIdLessThanOrEqualTo: '+value);
        var that = this;
            that.id = value;
        var filteredArrayOfModels =  this.filter( function(model) {
          var modelId =  model.get('id');
          //console.log('value = '+that.id + ' modelId = '+ modelId);
          //console.log('model',model);
          if ( modelId <= that.id ){
           //console.log('match', model);
           return model;
          }
        });
        //console.log('filteredArrayOfModels',filteredArrayOfModels);
        return new Stories(filteredArrayOfModels);
      },
      */
      sortByCompanyName: function() {
        console.log('Stories.sortByCompanyName');
        // update comparator function
        this.comparator = function(model) {
          return model.get('company');
        };
        // call the sort method
        this.sort();
      }

    });

    return Stories;
  });