model = models['Foo'].augment({
    sync: function(method, model, success, error) {
        model.set({ method: method });
        success(model);
    }
});
