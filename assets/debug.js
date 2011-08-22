window.onerror = function(message, url, line) {
    // Don't attempt to handle non-standard errors (e.g. failed
    // HTTP request via jQuery).
    if (typeof message !== 'string') return;
    $.ajax('/api/Error', {
        data: {
            message: message,
            url: url,
            line: line
        }
    });
};
