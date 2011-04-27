var assert = require('assert');
var Bones = require('..').Bones;

module.exports = {
  'test .pluralize()': function() {
    assert.equal('ids', Bones.pluralize('id'));
    assert.equal('friends', Bones.pluralize('friend'));
    assert.equal('buses', Bones.pluralize('bus'));
    assert.equal('misses', Bones.pluralize('miss'));
    assert.equal('wishes', Bones.pluralize('wish'));
    assert.equal('watches', Bones.pluralize('watch'));
    assert.equal('foxes', Bones.pluralize('fox'));
    assert.equal('potatoes', Bones.pluralize('potato'));
    assert.equal('parties', Bones.pluralize('party'));
    assert.equal('quizzes', Bones.pluralize('quiz'));
    assert.equal('things', Bones.pluralize('thing'));
    assert.equal('men', Bones.pluralize('man'));
    assert.equal('kisses', Bones.pluralize('kiss'));
    assert.equal('dishes', Bones.pluralize('dish'));
    assert.equal('judges', Bones.pluralize('judge'));
    assert.equal('massages', Bones.pluralize('massage'));
    assert.equal('monkeys', Bones.pluralize('monkey'));
    assert.equal('keys', Bones.pluralize('key'));
    assert.equal('dogs', Bones.pluralize('dog'));
    assert.equal('boys', Bones.pluralize('boy'));
    assert.equal('oxen', Bones.pluralize('ox'));
    assert.equal('indices', Bones.pluralize('index'));
    assert.equal('indices', Bones.pluralize('indice'));
  },

  'test .singularize()': function() {
    assert.equal('paper', Bones.singularize('papers'));
    assert.equal('ox', Bones.singularize('oxen'));
    assert.equal('shoe', Bones.singularize('shoes'));
    assert.equal('thing', Bones.singularize('things'));
    assert.equal('thing', Bones.singularize('thing'));
    assert.equal('man', Bones.singularize('men'));
    assert.equal('parenthesi', Bones.singularize('parenthesis'));
    assert.equal('bus', Bones.singularize('bus'));
    assert.equal('miss', Bones.singularize('miss'));
    assert.equal('kiss', Bones.singularize('kiss'));
    assert.equal('man', Bones.singularize('man'));
    assert.equal('monkey', Bones.singularize('monkeys'));
    assert.equal('key', Bones.singularize('keys'));
    assert.equal('boy', Bones.singularize('boys'));
    assert.equal('movie', Bones.singularize('movies'));
    assert.equal('series', Bones.singularize('series'));
    assert.equal('index', Bones.singularize('indices'));
  }
};