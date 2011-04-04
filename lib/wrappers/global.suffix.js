} catch(err) {
    var fixLines = new RegExp('(' + __filename + '):(\\d+):(\\d+)\\)', 'g');
    err.stack = err.stack.replace(fixLines,
    function(match, file, number, col) {
        var line = parseInt(number, 10);
        if (line >= __CONTENT_LENGTH__ + __PREFIX_LENGTH__) {
            return file + ')\n    in __SUFFIX_NAME__:' + (line - __CONTENT_LENGTH__ - __PREFIX_LENGTH__ + 1) + ':' + col;
        } else if (line >= __PREFIX_LENGTH__) {
            return file + ':' + (line - __PREFIX_LENGTH__ + 1) + ':' + col + ')';
        } else {
            return file + ')\n    in __PREFIX_NAME__:' + (line - __PREAMBLE_LENGTH__ + 1) + ':' + col;
        }
    });
    throw err;
}
