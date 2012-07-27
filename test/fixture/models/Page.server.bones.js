models['Page'].augment({
    sync: function(parent, method, model, options) {
        if (model.get('id') === 'asdf') {
            options.error();
        } else {
            model.set({ method: method });
            options.success(model);
        }
    }
});
