# Building Guru App with EmberCLI

Example app found at [http://goo.gl/K0Lf61](http://goo.gl/K0Lf61)

This app requires EmberCLI to be installed. You can install it via npm using `npm install -g ember-cli`

``` bash
$ ember new guru-app
$ cd guru-app
```

Install additional npm and bower dependencies

``` bash
$ npm install --save-dev broccoli-merge-trees
$ npm install --save-dev broccoli-static-compiler
$ npm install --save-dev broccoli-sass
$ bower install --save ratchet
```

---

Modify your Brocfile

``` javascript
/* global require, module */

var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

app.import('vendor/ratchet/js/modals.js');
app.import('vendor/ratchet/js/popovers.js');
app.import('vendor/ratchet/js/segmented-controllers.js');
app.import('vendor/ratchet/js/sliders.js');
app.import('vendor/ratchet/js/toggles.js');

var fonts = pickFiles('vendor/ratchet/fonts', {
  srcDir: '/',
  files: ['ratchicons.eot', 'ratchicons.svg', 'ratchicons.ttf', 'ratchicons.woff'],
  destDir: '/fonts'
});

module.exports = mergeTrees([app.toTree(), fonts]);
```
---

Rename `app/styles/app.css` to `app/styles/app.scss`

---

### Run the application

``` bash
$ ember serve
```

and open [http://localhost:4200](http://localhost:4200)

---

### Modify `index.html` head

``` html
<!-- Sets initial viewport load and disables zooming  -->
<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">

<!-- Makes your prototype chrome-less once bookmarked to your phone's home screen -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
```

---

### Create Application Adapter

``` bash
$ ember g adapter application
```

``` javascript
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'http://addressbook-api.herokuapp.com'
});
```

---

### Create Model

``` bash
$ ember g model contact
```

``` javascript
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
```

---

### Create Routes

``` bash
$ ember g route index
```

```javascript
import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function() {
    this.transitionTo('contacts.index');
  }
});
```

---

``` bash
$ ember g route contacts/index
```

``` javascript
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
```

---

``` bash
$ ember g route contacts/show
```

``` javascript
import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('contact', params.id);
  }
});
```

---

### Update Router

``` javascript
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
```

---

### Update `app.scss`

``` css
@import "vendor/ratchet/sass/ratchet";

.content {
  background-color: #efeff4;
  &.has-footer {
    padding-bottom: 45px;
  }
}

.bar-nav {
  background-color: #f7f7f7;
}

.table-view.has-header {
  margin-top: 0px !important;
}

.table-view-cell.media img {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
}

.card.padded {
  padding: 20px;
}

.spin {
  -webkit-animation: spin 2s infinite linear;
  -moz-animation: spin 2s infinite linear;
  -o-animation: spin 2s infinite linear;
  animation: spin 2s infinite linear;
}

@-moz-keyframes spin {
  from { -moz-transform: rotate(0deg); }
  to { -moz-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  from { -webkit-transform: rotate(0deg); }
  to { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
  from {transform:rotate(0deg);}
  to {transform:rotate(360deg);}
}
```

### Handlebars Templates

##### application.hbs

``` handlebars
{{outlet}}
```

##### contacts/index.hbs

``` handlebars
<header class="bar bar-nav">
  <h1 class="title">JavaScript Gurus</h1>
</header>

<div class="content has-footer">
  <div class="card">
    <ul class="table-view">
      {{#each contact in controller}}
      <li class="table-view-cell media">
        {{#link-to "contacts.show" contact class="navigate-right"}}
          <img class="media-object pull-left" {{bind-attr src=contact.avatar}}>
          <div class="media-body">
            {{contact.fullName}}
            <p>{{contact.id}}</p>
          </div>
        {{/link-to}}
      </li>
      {{/each}}
    </ul>
  </div>
</div>

<div class="bar bar-standard bar-footer">
  <a {{action "refresh"}} {{bind-attr class=":icon :icon-refresh isRefreshing:spin :pull-right"}}></a>
</div>
```

##### contacts/show.hbs

``` handlebars
<header class="bar bar-nav">
  {{#link-to 'contacts' class="icon icon-left-nav pull-left"}}{{/link-to}}
  <h1 class="title">JavaScript Gurus</h1>
</header>

<div class="content">
  <div class="card padded">
    <h3>{{fullName}}</h3>
    <p>Data would go here...</p>
  </div>
</div>
```