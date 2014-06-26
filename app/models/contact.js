import DS from 'ember-data';

export default DS.Model.extend({
  first  : DS.attr('string'),
  last   : DS.attr('string'),
  avatar : DS.attr('string'),
  github : DS.attr('string'),
  notes  : DS.attr('string'),

  fullName: function() {
    return this.get('first') + ' ' + this.get('last');
  }.property('first', 'last')
});
