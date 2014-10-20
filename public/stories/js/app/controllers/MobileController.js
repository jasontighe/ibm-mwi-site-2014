define(['App', 'backbone', 'marionette', 'views/MainView', 'views/MobileHeaderView'],
    function (App, Backbone, Marionette, MainView, MobileHeaderView) {
    return Backbone.Marionette.Controller.extend({
        initialize:function (options) {
            App.headerRegion.show(new MobileHeaderView());
        },
        //gets mapped to in AppRouter's appRoutes
        index:function () {
            App.mainRegion.show(new MainView());
        }

    });
});