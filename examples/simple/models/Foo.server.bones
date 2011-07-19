model = models['Foo'].augment({
    sync: function(method, model, options) {
        model.set({ method: method });
        options.success(model);
    }
});
