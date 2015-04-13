# d-load
Derby plugin for direct route component matching, using component's load fn to do route tasks

How to use
==========
In your app's base file (index.js in app root), activate the plugin in a non-Derby-standard way:
```javascript
require('d-load')(app);
```

Then, use route methods either as usual, e.g.:
```javascript
app.get(pattern, callback);
```

Or, directly binded to a component (which has NOT previously been added using app.component)
```javascript
app.get(pattern, require('myComponent'));
// or
app.get(pattern, require('myComponent'), {viewName: 'someViewName', ns: 'namespace to be passed into page.render'});
```

In your component, you can add a (optional) load fn to load things before page.render is called, e.g.:
```javascript
MyComponent.prototype.load = function (page, model, params, next) {
  // Do some data fetching before render
  model.fetch('data', function () {
    page.render(); // Will automatically trigger the proper rendering. If ns i passed in, it will override the default ns (which corresponds to the view associated with the component - see below)
  });
};
```

Notes:
- app.get will automatically bind the component upon initialization of the app
- When the route gets triggered, it will automatically render the component
- The component needs to have a view specified, if not the viewName options attribute is passed along:
```javascript
MyComponent.prototype.view = 'myView'
```



Adds the possibility to add a subcomponents on your Component prototype - i.e. without access to app. E.g.

```javascript
// When this component is loaded through app.component('./mycomponent/index.js'), the subcomponent will automatically be loaded namespaced to the maincomponents name (and possible namespace), i.e. you will have two components loaded (from below component):
// maincomponent
// maincomponent:subcomponent
function MyComponent () {}

MyComponent.prototype.name = 'maincomponent'
MyComponent.prototype.components = [require('subcomponent')]
```
