// Setup a closure variable whice records the time that the server was started.
// This is used to make sure static resources (css, js) have a different url
// when the code underneath them changes.
var time = Date.now();

/**
 * On the server the send method is overridden to provide the path to actually
 * send rendered pages to the browser. In addition to a rendered page, we also
 * append aJSON versions of any models/collections to the page that were used.
 * to construct it. While duplicative this allow us to easily re-attach those
 * same views back onto the DOM client side.
 */
routers.App.prototype.send = function(view, options) {
    var options = arguments.length > 1 ? arguments[1] : {};
    options.appView = new views.App();

    // Execute the main view.
    var main = new view(options);
    main.render();

    // Provide all models with the data that well be used to prop them back up
    // on the browser.
    var o = '{el: $("#main"),';
    _.each(options, function(v, k) {
        // appView options works differently on client and server so we omit it.
        if (k == 'appView') return;
        // Any options that is a model or collection will have it's title
        // declared. Use this to re-hydrate it.
        if (v.constructor.title != undefined) {
            o += JSON.stringify(k) + ': new models.'+ v.constructor.title +'('+ JSON.stringify(options[k]) + '),';
        } else {
            o += JSON.stringify(k) + ':' + JSON.stringify(options[k]) +',';
        }
    });
    o = o.replace(/,$/, '}');

    // Finally send the page to the client.
    this.res.send(Bones.plugin.templates.App({
        version: time,
        title: this.pageTitle(main),
        main: $(main.el).html(),
        startup: 'Bones.initialize(function(models, views, routers, templates) {'+
                 'new views.' + main.constructor.title +'('+ o +').attach().activeLinks().scrollTop()'+
                 '});'
    }));
};
