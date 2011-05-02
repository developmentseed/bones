var assert = require('assert');
var utils = require('bones').utils;

module.exports = {
  'test .pluralize()': function() {
    assert.equal('ids', utils.pluralize('id'));
    assert.equal('friends', utils.pluralize('friend'));
    assert.equal('buses', utils.pluralize('bus'));
    assert.equal('misses', utils.pluralize('miss'));
    assert.equal('wishes', utils.pluralize('wish'));
    assert.equal('watches', utils.pluralize('watch'));
    assert.equal('foxes', utils.pluralize('fox'));
    assert.equal('potatoes', utils.pluralize('potato'));
    assert.equal('parties', utils.pluralize('party'));
    assert.equal('quizzes', utils.pluralize('quiz'));
    assert.equal('things', utils.pluralize('thing'));
    assert.equal('men', utils.pluralize('man'));
    assert.equal('kisses', utils.pluralize('kiss'));
    assert.equal('dishes', utils.pluralize('dish'));
    assert.equal('judges', utils.pluralize('judge'));
    assert.equal('massages', utils.pluralize('massage'));
    assert.equal('monkeys', utils.pluralize('monkey'));
    assert.equal('keys', utils.pluralize('key'));
    assert.equal('dogs', utils.pluralize('dog'));
    assert.equal('boys', utils.pluralize('boy'));
    assert.equal('oxen', utils.pluralize('ox'));
    assert.equal('indices', utils.pluralize('index'));
    assert.equal('indices', utils.pluralize('indice'));
  },

  'test .singularize()': function() {
    assert.equal('paper', utils.singularize('papers'));
    assert.equal('ox', utils.singularize('oxen'));
    assert.equal('shoe', utils.singularize('shoes'));
    assert.equal('thing', utils.singularize('things'));
    assert.equal('thing', utils.singularize('thing'));
    assert.equal('man', utils.singularize('men'));
    assert.equal('parenthesi', utils.singularize('parenthesis'));
    assert.equal('bus', utils.singularize('bus'));
    assert.equal('miss', utils.singularize('miss'));
    assert.equal('kiss', utils.singularize('kiss'));
    assert.equal('man', utils.singularize('man'));
    assert.equal('monkey', utils.singularize('monkeys'));
    assert.equal('key', utils.singularize('keys'));
    assert.equal('boy', utils.singularize('boys'));
    assert.equal('movie', utils.singularize('movies'));
    assert.equal('series', utils.singularize('series'));
    assert.equal('index', utils.singularize('indices'));
  }
};