App = Ember.Application.create();

App.Store = DS.Store.extend({
  revision: 13,
  adapter: 'DS.FixtureAdapter'
});

App.Router.map(function() {
  this.resource( 'index', { path: '/' } );
  this.route("profile");
  this.route("profile.edit")
  this.resource("notifications", function(){
    this.route('new')
    this.resource("notification", {path: ":notification_id"}, function(){
      this.route('edit')
    })
  });
});

App.ProfileRoute = Ember.Route.extend({
  model: function(){
    return App.Profile.find('4bab3423423423424hade');
  }
});

App.ProfileEditRoute = Ember.Route.extend({
  model: function(){
    return App.Profile.find('4bab3423423423424hade');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
  }
});

App.ProfileController = Ember.ObjectController.extend({
  len: function () {
    var email = this.get('model.email');
    return email.length;
  }.property('model.len')
});

App.ProfileEditController = Ember.ObjectController.extend({
  submit: function () {

    var email    = this.get('email');
    var id       = this.get('id');

    var profile = App.Profile.find('4bab3423423423424hade') // hack for FIXTURE ADAPTER

    profile.set('email', email);

    var controller = this;

    profile.on('didUpdate', function(e){
      controller.transitionToRoute('profile');
    })

    profile.on('becameError', function(e){
      console.log('We have error sir! maybe validation failed ?')
    })

    var result = profile.save();

  }
});

App.NotificationsRoute = Ember.Route.extend({
  model: function(){
    return App.Notification.find();
  }
});

App.NotificationsNewController = Ember.ArrayController.extend({

  submit: function () {

    var name    = this.get('name');
    var to      = this.get('to');
    var message = this.get('message');

    var notification = App.Notification.createRecord({
      name: name,
      to: to,
      message: message,
      whenSent: new Date()
    });

    this.set('name', '');
    this.set('to', '');
    this.set('message', '');

    notification.save();
  }
});

App.Profile = DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  lastLoginAt: DS.attr('date')
});

App.Notification = DS.Model.extend({
  name: DS.attr('string'),
  to: DS.attr('string'), // will be conferted into clients list object
  message: DS.attr('string'),
  whenSent: DS.attr('date')
})

Ember.Handlebars.registerBoundHelper('dateFromNow', function(date){
  return moment(date).fromNow();
});

var markdown = new Showdown.converter('github');

Ember.Handlebars.registerBoundHelper('markdown', function(input){
  return new Ember.Handlebars.SafeString(markdown.makeHtml(input));
});

App.Profile.FIXTURES = [{
  id: '4bab3423423423424hade',
  email: 'jakub.oboza@gmail.com',
  lastLoginAt: new Date("01-31-1985")
}]

App.Notification.FIXTURES = [{
  id: 1,
  name: "three outage!",
  to: "clients, operations",
  message: "With his womb ferret slamming deep into my stench trench, the sensation of his devil's bagpipe smashing my cervix made me quake like jelly. With my hairy goblet now much like a werewolf with it's throat cut, he thought it was time to start plunging my Oxo orifice. Is now the time to tell him I really need to cop a colon cobra, I wondered? I can't wait to devour the magician's wax from his stilton spear. I awoke the next morning with my carp cavity still haemorrhaging. I thought it was over but his wrist-thick wand had other ideas. There was baby gravy draining from his sperminator and I was wetter than a bathmaid's elbow. We were ready for more.",
  whenSent: new Date("02-27-1985")
},{
  id: 2,
  name: "O2 node down :(",
  to: "operations",
  message: "Some girls are happy just to audition the finger puppets when they're alone, but I can't get off without having an egg timer in my split peach and a lightbulb up my balloon knot. Now, I've had more hands up me than The Muppets, but the sight of his chorizo howitzer made my shrimp sap slobber like Wayne Rooney's dick in an OAP home. The feeling of his magician's wax dripping down my throat got my minge mucus flowing quicker than greased shit off a shiny shovel. I awoke the next morning with my birth cannon still leaking. I thought it was over but his meaty member had other ideas. By now, my Quimcy, M.E. was flowing like Adele waiting for Greggs to open.",
  whenSent: new Date("02-27-1985")
}]


/// lolz
$(".hidden").hide();

App.EmailField = Ember.TextField.extend({
  change: function(evt) {
    var el = $(evt.target);
    var parent = $(el.parents(".control-group"))
    parent.addClass(".error")
    $(el.siblings('span.help-inline')).show()
  }
});