if (!controller) {
    throw new Error('No controller defined.');
}

module.exports = controller;

if (!controller.title) {
    controller.title = env.name;
}

global.plexus.controllers[controller.title] = controller;
