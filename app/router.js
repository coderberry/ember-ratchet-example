import Ember from 'ember';

var Router = Ember.Router.extend({
  location: GuruAppENV.locationType
});

Router.map(function() {
  this.resource('contacts', { path: '/contacts' }, function() {
    this.route('show', { path: '/:id' });
  });
});

export default Router;
