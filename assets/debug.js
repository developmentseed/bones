window.onerror = function(message, url, line) {
    $.ajax('/api/Error', {
        data: {
            message: message,
            url: url,
            line: line
        }
    });
};
