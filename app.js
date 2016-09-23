(function () {
  'use strict';

  sap.ui.getCore().attachInit(function () {

    jQuery.sap.registerModulePath('sap/ui/model/mobx', './src');

    sap.ui.require(['sap/ui/model/mobx/MobXModel', 'sap/ui/model/json/JSONModel'], function (MobxModel, JSONmodel) {

      var observableModel = mobx.observable({
        text: 'hello',
        nested: {
          text: ""
        },
        items: [{title:'1'}, {title:'2'}],
        get header() {
          return this.nested.text + ' dude!' + 'im having ' + this.items.length + ' items.';
        }
      });

      var MobxUi5Adapter = new MobxModel(observableModel);

      var input = new sap.m.Input({
        value: "{/nested/text}",
        valueLiveUpdate: true
      });

      var label = new sap.m.Label({
        text: '{/text}'
      });

      var button = new sap.m.Button({
        text: "press me",
        press: function () {
        // model.setProperty('/text', 'hello');
        observableModel.nested.text = 'awesome';
        // observableModel.items.push({title: '3'});
        // data.header = 'stuff';
        // model.setProperty('/text', 'world');
      }
      });

      //
      // var list = new sap.m.List({
      //    headerText:"{/header}",
      //     items: {
      //     path: '/items',
      //     template: new sap.m.StandardListItem({title:'{title}'})
      //   }
      // });


      new sap.m.VBox({
        items: [
          input,
          label,
          button
          // list
        ]
      })
        .setModel(MobxUi5Adapter)
        .placeAt('main');
    });
  });

})();