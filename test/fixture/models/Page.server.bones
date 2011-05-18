models['Page'].augment({
    sync: function(parent, method, model, success, error) {
        if (model.get('id') === 'asdf') {
            error();
        } else {
            model.set({ method: method });
            success(model);
        }
    }
});
