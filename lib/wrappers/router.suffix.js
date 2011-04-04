if (!router) {
    throw new Error('No router defined.');
}

module.exports = router;

if (!router.title) {
    router.title = env.name;
}

global.plexus.routers[router.title] = router;
