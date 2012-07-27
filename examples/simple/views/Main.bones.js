view = Backbone.View.extend({
    id: 'main',
    initialize: function(options) {
        this.app = options.appView;
    },
    attach: function() {
        return this;
    },
    // Scrolls to top or fragment
    // --------------------------
    scrollTop: function() {
        var offset = $(window.location.hash).offset();
        var top = offset ? offset.top : 0;
        // Scroll top FF, IE, Chrome safe
        if ($('body').scrollTop(0)) {
            $('body').scrollTop(top);
            return this;
        }
        if ($('html').scrollTop(0)) {
            $('html').scrollTop(top);
        }
        return this;
    },
    activeLinks: function() {
        var activePath = window.location.pathname;
        $('a.active').removeClass('active');
        $('a.exact').each(function(i, a) {
            activePath == $(a).attr('href') && $(a).addClass('active');
        });
        $('a:not(.exact)').each(function(i, a) {
            (activePath.indexOf($(a).attr('href')) == 0) && $(a).addClass('active');
        });
        return this;
    }
});
