model = Backbone.Model.extend({
    sync: function(parent, method, model, options) {
        if (model.get('id') === 'darwin') {
            options.error();
        } else {
            model.set({ method: method });
            options.success(model);
        }
    }
});
