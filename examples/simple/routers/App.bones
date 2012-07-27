router = Backbone.Router.extend({
    routes: {
        '/': 'home',
        '/about': 'about',
        '/project/:project': 'project'
    },

    // The `home` route...
    home: function() {
        var router = this,
            fetcher = this.fetcher(),
            projects = new models.Projects();

        fetcher.push(projects);
        fetcher.fetch(function(err) {
            if (err) return router.error(err);
            router.send(views.Home, {collection: projects});
        });
    },

    // The `About` route is completely static. It only needs to pass the proper
    // view (views.About) to be run.
    about: function() {
        this.send(views.About);
    },

    // The 'project' route needs to load a particular project.
    project: function(project) {
        var router = this,
            fetcher = this.fetcher(),
            project = new models.Project({id: project});

        fetcher.push(project);
        fetcher.fetch(function(err) {
            if (err) return router.error(err);
            router.send(views.Project, {model: project});
        });
    },

    // Helper to assemble the page title.
    pageTitle: function(view) {
        var title =  'What is Bones?';
        return (view.pageTitle ? view.pageTitle + ' | ' + title : title);
    },

    // The send method is...
    send: function(view) {
        var options = (arguments.length > 1 ? arguments[1] : {});
        this.appView = this.appView || new views.App();
        options.appView = this.appView;
        var v = new view(options);

        // Populate the #page div with the main view.
        $('#page').empty().append(v.el);

        // TODO explain this!
        v.render().attach().activeLinks().scrollTop();

        // Set the page title.
        document.title = this.pageTitle(v);
    },

    // Generic error handling for our Router.
    error: function(error) {
        this.send(views.Error, _.isArray(error) ? error.shift() : error);
    },

    // Helper to fetch a set of models/collections in parrellel.
    fetcher: function() {
        var models = [];

        return {
            push: function(item) { models.push(item) },
            fetch: function(callback) {
                if (!models.length) return callback();
                var errors = [];
                var _done = _.after(models.length, function() {
                    callback(errors.length ? errors : null);
                });
                _.each(models, function(model) {
                    model.fetch({
                        success: _done,
                        error: function(error) {
                            errors.push(error);
                            _done();
                        }
                    });
                });
            }
        }
    }
});
