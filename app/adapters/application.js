import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'http://addressbook-api.herokuapp.com'
});
