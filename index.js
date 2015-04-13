var _ = require('lodash');

module.exports = function (app) {
  ['get', 'post', 'put', 'del', 'enter', 'exit'].forEach(function (method) {
    app['_' + method] = app[method];

    app[method] = function (pattern, component, options) {
      var options = options || {};
      var viewName = options.viewName || null;
      var ns = options.ns || null;

      // If no options/viewName is passed along, and no view is specified on the component prototype, then assume regular route.
      if(arguments.length === 2 && !viewName && !component.prototype.view) return app['_' + method].apply(this, arguments);

      // Don't accept components without a view specified
      if(!component.prototype.view) throw new Error('Components must have views specified when in routes!');

      // Register component
      this.component(viewName, component, ns);

      app['_' + method].call(this, pattern, function (page, model, params, next) {
        var viewName = viewName || component.prototype.name;

        // No load fn existed, let's just render
        if(!component.prototype.load) return page.render(viewName);

        // Overwrite page in order to be able to overwrite the render fn to 
        var _page = _.clone(page);

        _page.render = function (ns) {
          var ns = ns || viewName;

          page.render(ns);
        };

        component.prototype.load.call(this, _page, model, params, next);
      });
    }
  });
};
