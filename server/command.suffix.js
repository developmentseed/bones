if (command && !command.title) {
    command.title = require('path').basename(__filename).replace(/\..+$/, '');
}

module.exports = command;
