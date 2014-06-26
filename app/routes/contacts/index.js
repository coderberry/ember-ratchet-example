import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('contact');
  },

  actions: {
    refresh: function() {
      this.controller.set('isRefreshing', true);
      Ember.run.later(this, function() {
        this.store.find('contact').then(function(data) {
          this.controller.set('content', data);
          this.controller.set('isRefreshing', false);
        }.bind(this));
      }, 3000);
    }
  }
});
