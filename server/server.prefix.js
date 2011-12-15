var Bones = require(global.__BonesPath__ || 'bones');

var $ = Bones.$, jQuery = $;
var _ = Bones._;
var Backbone = Bones.Backbone;
var middleware = Bones.middleware;
var mirror = Bones.mirror;

var models = Bones.plugin.models;
var views = Bones.plugin.views;
var controllers = Bones.plugin.controllers;
var templates = Bones.plugin.templates;
var servers = Bones.plugin.servers;

var server;
